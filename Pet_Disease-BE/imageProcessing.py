import numpy as np
import cv2
import sys

Alpha = None

def ProcessImage(filename,ProcessingFactor):
    OriginalImage = cv2.imread(filename)
    b = OriginalImage[:, :, 0]
    g = OriginalImage[:, :, 1]
    r = OriginalImage[:, :, 2]
    Disease = r - g
    global Alpha
    Alpha = b
    GetAlpha(OriginalImage)
    for i in range(0, OriginalImage.shape[0]):
        for j in range(0, OriginalImage.shape[1]):
            if int(g[i, j]) > ProcessingFactor:
                Disease[i, j] = 255
    DiseasePercentage = DisplayDiseasePercentage(Disease,ProcessingFactor)
    return DiseasePercentage
    
def CountWhiteDots(filename):
    OriginalImage = cv2.imread(filename)
    blue = OriginalImage[:, :, 0]
    thresh = cv2.threshold(blue,210,255, cv2.THRESH_BINARY)[1]
    cnts = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    min_area = 0
    white_dots = []
    for c in cnts:
        area = cv2.contourArea(c)
        if area > min_area:
            cv2.drawContours(OriginalImage, [c], -1, (220, 20, 60), 2)
            white_dots.append(c)
    
    return len(white_dots)

def CountYellowDots(filename):
    OriginalImage = cv2.imread(filename)
    g = cv2.cvtColor(OriginalImage, cv2.COLOR_BGR2HSV)
    lower_yellow = np.array([25,150,50], dtype="uint8")   
    upper_yellow = np.array([35,255,255], dtype="uint8")
    mask = cv2.inRange(OriginalImage, lower_yellow, upper_yellow)
    cnts = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    yellow_dots = []
    for c in cnts:
        x,y,w,h = cv2.boundingRect(c)
        cv2.rectangle(OriginalImage, (x, y), (x + w, y + h), (36,255,12), 2)
        yellow_dots.append(c)
    
    return len(yellow_dots)

def CountRedDots(filename):
    OriginalImage = cv2.imread(filename)
    g = cv2.cvtColor(OriginalImage, cv2.COLOR_BGR2HSV)
    lower = np.array([0,50,50], dtype="uint8")
    upper = np.array([10,255,255], dtype="uint8")
    mask = cv2.inRange(g, lower, upper)
    cnts = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    red_dots = []
    for c in cnts:
        if 3 < cv2.contourArea(c) <20:
            cv2.drawContours(OriginalImage, [c], -1, (220, 20, 60), 2)
            red_dots.append(c)
    
    return len(red_dots)

def CountLupus(filename):
    OriginalImage = cv2.imread(filename)
    g = cv2.cvtColor(OriginalImage, cv2.COLOR_BGR2HSV)
    lower = np.array([155,25,0], dtype="uint8")
    upper = np.array([179,255,255], dtype="uint8")
    mask = cv2.inRange(g, lower, upper)
    cnts = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    lupus = []
    for c in cnts:
        if 800 < cv2.contourArea(c):
            cv2.drawContours(OriginalImage, [c], -1, (220, 20, 60), 2)
            lupus.append(c)
    
    return len(lupus)

def CountMange(filename):
    OriginalImage = cv2.imread(filename)
    g = cv2.cvtColor(OriginalImage, cv2.COLOR_BGR2HSV)
    lower = np.array([0,150,50], dtype="uint8")
    upper = np.array([35,255,255], dtype="uint8")
    mask = cv2.inRange(g, lower, upper)

    cnts = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    mange = []
    for c in cnts:
        if 100 < cv2.contourArea(c) <400:
            cv2.drawContours(OriginalImage, [c], -1, (220, 20, 60), 2)
            mange.append(c)
    
    return len(mange)

def GetAlpha(OriginalImage):
    global Alpha
    for i in range(0, OriginalImage.shape[0]):
        for j in range(0, OriginalImage.shape[1]):
            if OriginalImage[i, j, 0] > 200 and OriginalImage[i, j, 1] > 200 and OriginalImage[i, j, 2] > 200:
                Alpha[i, j] = 255
            else:
                Alpha[i, j] = 0


def DisplayDiseasePercentage(Disease,ProcessingFactor):
    Count = 0
    Res = 0
    for i in range(0, Disease.shape[0]):
        for j in range(0, Disease.shape[1]):
            if Alpha[i, j] == 0:
                Res += 1
            if Disease[i, j] < ProcessingFactor:
                Count += 1
    Percent = (Count / Res) * 100
    DiseasePercent =  str(round(Percent, 2))
    return DiseasePercent


def detectionOutput(filename,ProcessingFactor):
    DiseasePercentage = ProcessImage(filename, ProcessingFactor)
    WhiteDotsCount = CountWhiteDots(filename)
    YellowDotsCount = CountYellowDots(filename)
    RedDotsCount = CountRedDots(filename)
    Lupus = CountLupus(filename)
    Mange = CountMange(filename)
    
    return DiseasePercentage, WhiteDotsCount, YellowDotsCount, RedDotsCount, Lupus, Mange