from PyQt5 import QtCore, QtGui, QtWidgets
import os
os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = "../platforms"

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(850, 650)

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        # Tiêu đề
        self.label = QtWidgets.QLabel("RSA Digital Signature", self.centralwidget)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        font = QtGui.QFont()
        font.setPointSize(22)
        font.setBold(True)
        self.label.setFont(font)

        # Plain text
        self.group_plain = QtWidgets.QGroupBox("Plain Text")
        self.txt_plain_text = QtWidgets.QTextEdit()
        layout_plain = QtWidgets.QVBoxLayout()
        layout_plain.addWidget(self.txt_plain_text)
        self.group_plain.setLayout(layout_plain)

        # Cipher text
        self.group_cipher = QtWidgets.QGroupBox("Cipher Text")
        self.txt_cipher_text = QtWidgets.QTextEdit()
        layout_cipher = QtWidgets.QVBoxLayout()
        layout_cipher.addWidget(self.txt_cipher_text)
        self.group_cipher.setLayout(layout_cipher)

        # Info
        self.group_info = QtWidgets.QGroupBox("Info")
        self.txt_info = QtWidgets.QTextEdit()
        layout_info = QtWidgets.QVBoxLayout()
        layout_info.addWidget(self.txt_info)
        self.group_info.setLayout(layout_info)

        # Signature
        self.group_sign = QtWidgets.QGroupBox("Signature")
        self.txt_sign = QtWidgets.QTextEdit()
        layout_sign = QtWidgets.QVBoxLayout()
        layout_sign.addWidget(self.txt_sign)
        self.group_sign.setLayout(layout_sign)

        # Nút chức năng
        self.btn_gen_keys = QtWidgets.QPushButton("Generate Keys")
        self.btn_encrypt = QtWidgets.QPushButton("Encrypt")
        self.btn_decrypt = QtWidgets.QPushButton("Decrypt")
        self.btn_sign = QtWidgets.QPushButton("Sign")
        self.btn_verify = QtWidgets.QPushButton("Verify")

        button_layout = QtWidgets.QHBoxLayout()
        button_layout.addStretch()
        button_layout.addWidget(self.btn_gen_keys)
        button_layout.addWidget(self.btn_encrypt)
        button_layout.addWidget(self.btn_decrypt)
        button_layout.addWidget(self.btn_sign)
        button_layout.addWidget(self.btn_verify)
        button_layout.addStretch()

        # Bố cục chính
        main_layout = QtWidgets.QVBoxLayout(self.centralwidget)
        main_layout.addWidget(self.label)
        main_layout.addWidget(self.group_plain)
        main_layout.addWidget(self.group_cipher)
        main_layout.addWidget(self.group_info)
        main_layout.addWidget(self.group_sign)
        main_layout.addLayout(button_layout)

        MainWindow.setCentralWidget(self.centralwidget)

        # Menu và status bar
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 21))
        MainWindow.setMenuBar(self.menubar)

        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "RSA Digital Signature"))

# Run
if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())
