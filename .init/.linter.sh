#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-to-do-list-manager-5753/backend_api
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

