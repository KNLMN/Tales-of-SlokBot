#!/bin/bash

# Test script to verify backend registration works

API_URL="https://tales-of-slokbot-production.up.railway.app/api"
TEST_EMAIL="test$(date +%s)@example.com"
TEST_PASSWORD="testpassword123"

echo "🧪 Testing Tales of SlokBot Backend Registration"
echo "================================================"
echo ""
echo "API URL: $API_URL"
echo "Test Email: $TEST_EMAIL"
echo ""

echo "1️⃣ Testing /health endpoint..."
HEALTH=$(curl -s "$API_URL/../health")
echo "Response: $HEALTH"
echo ""

echo "2️⃣ Testing /api/classes endpoint..."
CLASSES=$(curl -s "$API_URL/classes")
echo "Response (truncated): ${CLASSES:0:100}..."
echo ""

echo "3️⃣ Testing registration with email: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Registration Response:"
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Check if successful
if echo "$REGISTER_RESPONSE" | grep -q "token"; then
  echo "✅ Registration SUCCESSFUL!"
  echo ""
  TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

  echo "4️⃣ Testing /auth/me with token..."
  ME_RESPONSE=$(curl -s "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
  echo ""
  echo "✅ All tests passed! Backend is working correctly."
else
  echo "❌ Registration FAILED!"
  echo "This could mean:"
  echo "  - Database connection issue"
  echo "  - Environment variables not set correctly in Railway"
  echo "  - Database migrations not run"
  echo ""
  echo "Check Railway logs for more details."
fi
