#!/usr/bin/env python3
"""
이미지 배경 제거 스크립트
사용법: python remove_bg.py

먼저 rembg 설치 필요:
pip install rembg pillow
"""

from rembg import remove
from PIL import Image
import os

# 입력/출력 파일 경로
input_path = 'frontend/public/images/profile.png'
output_path = 'frontend/public/images/profile_transparent.png'

# 배경 제거
try:
    print(f"배경 제거 중: {input_path}")
    
    # 이미지 열기
    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()
    
    # 배경 제거
    output_data = remove(input_data)
    
    # 결과 저장
    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)
    
    print(f"✅ 완료! 저장 위치: {output_path}")
    print(f"원본 파일을 교체하려면:")
    print(f"  mv {output_path} {input_path}")
    
except FileNotFoundError:
    print(f"❌ 오류: {input_path} 파일을 찾을 수 없습니다.")
except Exception as e:
    print(f"❌ 오류 발생: {e}")
