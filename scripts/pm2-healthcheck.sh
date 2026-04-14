#!/bin/bash
# PM2 健康检查脚本

HEALTH=$(pm2 list | grep -c "online")
ERROR=$(pm2 list | grep -c "errored")

if [ $ERROR -gt 0 ]; then
  echo "CRITICAL: $ERROR PM2 process(es) in errored state"
  exit 2
elif [ $HEALTH -eq 0 ]; then
  echo "CRITICAL: No PM2 processes running"
  exit 2
else
  echo "OK: $HEALTH PM2 process(es) running"
  exit 0
fi
