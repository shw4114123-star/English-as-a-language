@echo off
chcp 65001 > nul
echo ==============================================
echo   מעלה שינויים ל-GitHub לעדכון אוטומטי ברנדר
echo ==============================================

git add .
set /p msg="הכנס הודעת עדכון (או לחץ Enter לברירת מחדל): "
if "%msg%"=="" set msg=update: site changes

git commit -m "%msg%"
git push origin main

echo.
echo ==============================================
echo השינויים עלו בהצלחה ל-GitHub!
echo רנדר (Render) מזהה את השינוי ומתחיל לעדכן אוטומטית.
echo תוך 1-3 דקות האתר יהיה מעודכן בקישור:
echo https://english-as-a-language.onrender.com
echo ==============================================
pause
