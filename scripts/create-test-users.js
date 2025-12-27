#!/usr/bin/env node

/**
 * Quick script to create test users for local testing
 * Usage: node scripts/create-test-users.js
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3001';

const testUsers = [
  { username: 'alice', email: 'alice@test.com', password: 'password123' },
  { username: 'bob', email: 'bob@test.com', password: 'password123' },
  { username: 'charlie', email: 'charlie@test.com', password: 'password123' },
  { username: 'diana', email: 'diana@test.com', password: 'password123' },
];

function createUser(user) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(user);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          const result = JSON.parse(body);
          console.log(`✅ Created user: ${user.username} (${user.email})`);
          resolve(result);
        } else {
          const error = JSON.parse(body);
          if (error.message && error.message.includes('already exists')) {
            console.log(`⚠️  User already exists: ${user.username} (${user.email})`);
            resolve(null);
          } else {
            console.error(`❌ Failed to create ${user.username}:`, error.message || body);
            reject(new Error(error.message || `HTTP ${res.statusCode}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request error for ${user.username}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Creating test users...\n');
  console.log(`API URL: ${API_URL}\n`);

  for (const user of testUsers) {
    try {
      await createUser(user);
    } catch (error) {
      console.error(`Failed to create ${user.username}:`, error.message);
    }
  }

  console.log('\n✨ Done! You can now log in with any of these users:');
  testUsers.forEach((user) => {
    console.log(`   - ${user.username} (${user.email}) / password: ${user.password}`);
  });
  console.log('\n💡 Tip: Use different browser windows/tabs to test with multiple users simultaneously.');
}

main().catch(console.error);

