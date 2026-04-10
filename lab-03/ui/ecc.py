from PyQt5 import QtCore, QtGui, QtWidgets
import os
os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = "../platforms"

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 600)

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        # Tiêu đề
        self.label = QtWidgets.QLabel("ECC Digital Signature", self.centralwidget)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        font = QtGui.QFont()
        font.setPointSize(22)
        font.setBold(True)
        self.label.setFont(font)

        # Nhóm nhập thông tin
        self.group_info = QtWidgets.QGroupBox("Information", self.centralwidget)
        self.txt_info = QtWidgets.QTextEdit(self.group_info)
        layout_info = QtWidgets.QVBoxLayout()
        layout_info.addWidget(self.txt_info)
        self.group_info.setLayout(layout_info)

        # Nhóm chữ ký
        self.group_sign = QtWidgets.QGroupBox("Signature", self.centralwidget)
        self.txt_sign = QtWidgets.QTextEdit(self.group_sign)
        layout_sign = QtWidgets.QVBoxLayout()
        layout_sign.addWidget(self.txt_sign)
        self.group_sign.setLayout(layout_sign)

        # Các nút thao tác
        self.btn_gen_keys = QtWidgets.QPushButton("Generate Keys")
        self.btn_sign = QtWidgets.QPushButton("Sign")
        self.btn_verify = QtWidgets.QPushButton("Verify")

        button_layout = QtWidgets.QHBoxLayout()
        button_layout.addStretch()
        button_layout.addWidget(self.btn_gen_keys)
        button_layout.addWidget(self.btn_sign)
        button_layout.addWidget(self.btn_verify)
        button_layout.addStretch()

        # Bố cục chính
        main_layout = QtWidgets.QVBoxLayout(self.centralwidget)
        main_layout.addWidget(self.label)
        main_layout.addWidget(self.group_info)
        main_layout.addWidget(self.group_sign)
        main_layout.addLayout(button_layout)

        MainWindow.setCentralWidget(self.centralwidget)

        # Thanh menu và status
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 21))
        MainWindow.setMenuBar(self.menubar)

        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "ECC Digital Signature"))

# Run
if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())
