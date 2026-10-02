@echo off
chcp 65001 >nul
title COMMA ONE - Claude Remote Control
cd /d C:\comma_one

echo.
echo ==========================================
echo   COMMA ONE - Claude Remote Control
echo ==========================================
echo.
echo Project: C:\comma_one
echo.
echo [그냥 Enter]   이전 세션에 이어서 연결 (기존 대화 유지)
echo [이름 입력]    새 세션으로 시작 (예: kim, 작업지시서2 - 한글 가능)
echo.

rem 입력과 실행을 PowerShell 한 번에 처리한다.
rem cmd의 set /p 는 chcp 65001 에서 한글 입력이 깨지거나 비어서 기본 이름으로 바뀌는 문제가 있다.
rem 이전 세션 연결 정보(bridge-pointer.json)는 삭제하지 않고 .prev 로 옆으로 치운다. 기존 세션은 앱 목록에 그대로 남는다.
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Console]::InputEncoding=[Text.Encoding]::UTF8; [Console]::OutputEncoding=[Text.Encoding]::UTF8; $m=(Read-Host '입력'); $m=($m -replace [char]34,'').Trim(); if(-not $m){ Write-Host ''; Write-Host '이전 세션에 이어서 연결합니다.'; Write-Host 'Do not close this window while using Claude Remote Control.'; Write-Host ''; claude remote-control } else { if($m -ieq 'N'){ $n=(Read-Host '새 세션 이름 (그냥 Enter = COMMA ONE)'); $n=($n -replace [char]34,'').Trim(); if(-not $n){$n='COMMA ONE'} } else { $n=$m }; $p=Join-Path $env:USERPROFILE '.claude\projects\C--comma-one\bridge-pointer.json'; if(Test-Path $p){Move-Item $p ($p+'.prev') -Force}; Write-Host ''; Write-Host ('새 세션 이름: ' + $n); Write-Host 'Do not close this window while using Claude Remote Control.'; Write-Host ''; claude remote-control --name $n --remote-control-session-name-prefix $n }"

echo.
echo ==========================================
echo Claude Remote Control has stopped.
echo ==========================================
echo.
pause
