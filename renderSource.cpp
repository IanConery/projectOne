bool WebPage::render(const QString& fileName, const QVariantMap& option)
{
    if (m_mainFrame->contentsSize().isEmpty()) {
        return false;
    }

    QString outFileName = fileName;
    QString tempFileName = "";

    QString format = "";
    int quality = -1; // QImage#save default

    if (fileName == STDOUT_FILENAME || fileName == STDERR_FILENAME) {
        if (!QFile::exists(fileName)) {
            // create temporary file for OS that have no /dev/stdout or /dev/stderr. (ex. windows)
            tempFileName = QDir::tempPath() + "/phantomjstemp" + QUuid::createUuid().toString();
            outFileName = tempFileName;
        }

        format = "png"; // default format for stdout and stderr
    } else {
        QFileInfo fileInfo(outFileName);
        QDir dir;
        dir.mkpath(fileInfo.absolutePath());
    }

    if (option.contains("format")) {
        format = option.value("format").toString();
    } else if (fileName.endsWith(".pdf", Qt::CaseInsensitive)) {
        format = "pdf";
    }

    if (option.contains("quality")) {
        quality = option.value("quality").toInt();
    }

    bool retval = true;
    if (format == "pdf") {
        retval = renderPdf(outFileName);
    } else {
        QImage rawPageRendering = renderImage();

        const char* f = 0; // 0 is QImage#save default
        if (format != "") {
            f = format.toLocal8Bit().constData();
        }

        retval = rawPageRendering.save(outFileName, f, quality);
    }

    if (tempFileName != "") {
        // cleanup temporary file and render to stdout or stderr
        QFile i(tempFileName);
        i.open(QIODevice::ReadOnly);

        QByteArray ba = i.readAll();

        System* system = (System*)Phantom::instance()->createSystem();
        if (fileName == STDOUT_FILENAME) {
#ifdef Q_OS_WIN
            _setmode(_fileno(stdout), O_BINARY);
#endif

            ((File*)system->_stdout())->write(QString::fromLatin1(ba.constData(), ba.size()));

#ifdef Q_OS_WIN
            _setmode(_fileno(stdout), O_TEXT);
#endif
        } else if (fileName == STDERR_FILENAME) {
#ifdef Q_OS_WIN
            _setmode(_fileno(stderr), O_BINARY);
#endif

            ((File*)system->_stderr())->write(QString::fromLatin1(ba.constData(), ba.size()));

#ifdef Q_OS_WIN
            _setmode(_fileno(stderr), O_TEXT);
#endif
        }

        i.close();

        QFile::remove(tempFileName);
    }

    return retval;
}