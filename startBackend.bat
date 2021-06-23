@echo off

@REM Frontend adress
set FRONTEND="http://localhost:3000"

cd Backend

cls

npm start %FRONTEND%
