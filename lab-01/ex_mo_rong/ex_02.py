import re

def tinh_tong_so_am_duong(s):
    so_nguyen = re.findall(r'-?\d+', s)
    tong_duong = 0
    tong_am = 0
    for so in so_nguyen:
        gia_tri = int(so)
        if gia_tri > 0:
            tong_duong += gia_tri
        elif gia_tri < 0:
            tong_am += gia_tri
    return tong_duong, tong_am
chuoi = input("Nhập chuỗi chứa số nguyên: ")

tong_duong, tong_am = tinh_tong_so_am_duong(chuoi)
print("Giá trị dương:", tong_duong)
print("Giá trị âm:", tong_am)
