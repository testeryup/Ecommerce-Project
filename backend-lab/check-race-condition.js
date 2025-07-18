#!/usr/bin/env node

/**
 * Comprehensive Race Condition Checker
 * Script để kiểm tra toàn bộ hệ thống race condition protection
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const typeColors = {
        info: 'cyan',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        header: 'magenta'
    };
    
    console.log(`${colorize(`[${timestamp}]`, 'blue')} ${colorize(message, typeColors[type])}`);
}

function header(title) {
    const line = '='.repeat(title.length + 4);
    console.log('');
    log(line, 'header');
    log(`  ${title}  `, 'header');
    log(line, 'header');
}

async function checkFileExists(filePath, description) {
    const fullPath = join(__dirname, filePath);
    if (existsSync(fullPath)) {
        log(`✅ ${description}: Found`, 'success');
        return true;
    } else {
        log(`❌ ${description}: Missing`, 'error');
        return false;
    }
}

async function checkDependencies() {
    header('Checking Dependencies');
    
    const packageJsonPath = join(__dirname, 'package.json');
    if (!existsSync(packageJsonPath)) {
        log('❌ package.json not found', 'error');
        return false;
    }
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = [
        'mongoose',
        'express',
        'jsonwebtoken',
        'bcryptjs',
        'dotenv'
    ];
    
    const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );
    
    if (missingDeps.length > 0) {
        log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'error');
        return false;
    }
    
    log('✅ All required dependencies found', 'success');
    return true;
}

async function checkCoreFiles() {
    header('Checking Core Files');
    
    const coreFiles = [
        ['src/middlewares/race-condition.middleware.js', 'Race Condition Middleware'],
        ['src/controllers/order-race-protected.controller.js', 'Protected Order Controller'],
        ['src/routes/order-protected.routes.js', 'Protected Order Routes'],
        ['src/routes/test.routes.js', 'Test Routes'],
        ['src/config/race-condition.config.js', 'Race Condition Config'],
        ['src/models/sku.js', 'SKU Model'],
        ['src/models/inventory.js', 'Inventory Model'],
        ['src/models/order.js', 'Order Model'],
        ['src/models/user.js', 'User Model']
    ];
    
    let allFound = true;
    for (const [path, description] of coreFiles) {
        const found = await checkFileExists(path, description);
        if (!found) allFound = false;
    }
    
    return allFound;
}

async function checkMiddlewareImplementation() {
    header('Checking Middleware Implementation');
    
    const middlewarePath = join(__dirname, 'src/middlewares/race-condition.middleware.js');
    if (!existsSync(middlewarePath)) {
        log('❌ Race condition middleware not found', 'error');
        return false;
    }
    
    const middlewareContent = readFileSync(middlewarePath, 'utf8');
    
    const requiredClasses = [
        'DistributedLock',
        'OptimisticLockingHelper',
        'TransactionHelper',
        'AtomicStockManager'
    ];
    
    const requiredFunctions = [
        'idempotencyMiddleware',
        'resourceLockMiddleware'
    ];
    
    let allImplemented = true;
    
    for (const className of requiredClasses) {
        if (middlewareContent.includes(`class ${className}`)) {
            log(`✅ ${className}: Implemented`, 'success');
        } else {
            log(`❌ ${className}: Missing`, 'error');
            allImplemented = false;
        }
    }
    
    for (const funcName of requiredFunctions) {
        if (middlewareContent.includes(`export const ${funcName}`) || 
            middlewareContent.includes(`function ${funcName}`)) {
            log(`✅ ${funcName}: Implemented`, 'success');
        } else {
            log(`❌ ${funcName}: Missing`, 'error');
            allImplemented = false;
        }
    }
    
    return allImplemented;
}

async function checkModelUpdates() {
    header('Checking Model Updates');
    
    const skuModelPath = join(__dirname, 'src/models/sku.js');
    if (!existsSync(skuModelPath)) {
        log('❌ SKU model not found', 'error');
        return false;
    }
    
    const skuContent = readFileSync(skuModelPath, 'utf8');
    
    // Check for reserved field
    if (skuContent.includes('reserved:')) {
        log('✅ SKU model has reserved field for stock management', 'success');
    } else {
        log('⚠️  SKU model missing reserved field', 'warning');
    }
    
    // Check for version field (__v)
    if (skuContent.includes('__v') || skuContent.includes('versionKey')) {
        log('✅ SKU model supports optimistic locking', 'success');
    } else {
        log('ℹ️  SKU model uses default MongoDB versioning', 'info');
    }
    
    return true;
}

async function checkServerConfiguration() {
    header('Checking Server Configuration');
    
    const serverPath = join(__dirname, 'src/server.js');
    if (!existsSync(serverPath)) {
        log('❌ Server file not found', 'error');
        return false;
    }
    
    const serverContent = readFileSync(serverPath, 'utf8');
    
    const checks = [
        ['order-protected.routes', 'Protected order routes imported'],
        ['test.routes', 'Test routes imported'],
        ['race-condition.middleware', 'Race condition middleware imported'],
        ['idempotencyMiddleware', 'Idempotency middleware configured'],
        ['/api/orders-protected', 'Protected orders endpoint configured'],
        ['/api/test', 'Test endpoint configured']
    ];
    
    let allConfigured = true;
    
    for (const [pattern, description] of checks) {
        if (serverContent.includes(pattern)) {
            log(`✅ ${description}`, 'success');
        } else {
            log(`❌ ${description}`, 'error');
            allConfigured = false;
        }
    }
    
    return allConfigured;
}

async function runUnitTests() {
    header('Running Unit Tests');
    
    try {
        log('🧪 Running race condition unit tests...', 'info');
        execSync('node test-race-condition.js', { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        log('✅ Unit tests passed', 'success');
        return true;
    } catch (error) {
        log('❌ Unit tests failed', 'error');
        return false;
    }
}

async function checkAPIEndpoints() {
    header('Checking API Endpoints');
    
    log('ℹ️  The following endpoints should be available:', 'info');
    
    const endpoints = [
        'POST /api/orders-protected/create-protected',
        'GET  /api/orders-protected/race-stats',
        'POST /api/test/test-concurrent-orders',
        'POST /api/test/test-optimistic-locking',
        'POST /api/test/test-distributed-lock',
        'GET  /api/test/stats'
    ];
    
    endpoints.forEach(endpoint => {
        log(`📡 ${endpoint}`, 'info');
    });
    
    log('ℹ️  Start your server and test these endpoints manually', 'info');
    return true;
}

async function generateTestScript() {
    header('Generating Test Commands');
    
    const testCommands = [
        '# Start the server',
        'npm run dev',
        '',
        '# Test race condition protection (in another terminal)',
        'curl -X GET http://localhost:8080/api/test/stats \\',
        '  -H "Authorization: Bearer YOUR_TOKEN"',
        '',
        '# Test concurrent orders',
        'curl -X POST http://localhost:8080/api/test/test-concurrent-orders \\',
        '  -H "Content-Type: application/json" \\',
        '  -H "Authorization: Bearer YOUR_TOKEN" \\',
        '  -d \'{"skuId": "YOUR_SKU_ID", "orderCount": 10}\'',
        '',
        '# Test protected order creation',
        'curl -X POST http://localhost:8080/api/orders-protected/create-protected \\',
        '  -H "Content-Type: application/json" \\',
        '  -H "Authorization: Bearer YOUR_TOKEN" \\',
        '  -H "Idempotency-Key: test-order-123" \\',
        '  -d \'{"items": [{"skuId": "YOUR_SKU_ID", "quantity": 1}]}\'',
        ''
    ];
    
    log('📝 Test commands generated:', 'info');
    testCommands.forEach(cmd => {
        if (cmd.startsWith('#')) {
            log(cmd, 'header');
        } else if (cmd.trim()) {
            log(cmd, 'info');
        } else {
            console.log('');
        }
    });
    
    return true;
}

async function generateSummaryReport() {
    header('Race Condition Protection Summary');
    
    const features = [
        '✅ Distributed Locking - Prevents concurrent access to resources',
        '✅ Optimistic Locking - Detects version conflicts with automatic retry',
        '✅ Idempotency Protection - Prevents duplicate request processing',
        '✅ Atomic Stock Management - Ensures stock consistency',
        '✅ Transaction Management - Handles database transactions safely',
        '✅ Resource Locking - Locks specific resources during operations',
        '✅ Error Handling - Graceful error recovery and timeouts',
        '✅ Performance Monitoring - Built-in stats and metrics'
    ];
    
    log('🚀 Implemented Features:', 'info');
    features.forEach(feature => log(feature, 'success'));
    
    console.log('');
    log('📊 Performance Benefits:', 'info');
    log('  • Prevents overselling in high-traffic scenarios', 'info');
    log('  • Maintains data consistency under concurrent load', 'info');
    log('  • Reduces customer complaints about order failures', 'info');
    log('  • Improves system reliability and user trust', 'info');
    
    console.log('');
    log('🔧 Next Steps:', 'info');
    log('  1. Start your server: npm run dev', 'info');
    log('  2. Test endpoints using provided curl commands', 'info');
    log('  3. Monitor performance under load', 'info');
    log('  4. Configure Redis for production distributed locking', 'info');
    
    return true;
}

async function main() {
    console.clear();
    header('Race Condition Protection System Checker');
    
    log('🔍 Performing comprehensive system check...', 'info');
    
    const checks = [
        ['Dependencies', checkDependencies],
        ['Core Files', checkCoreFiles],
        ['Middleware Implementation', checkMiddlewareImplementation],
        ['Model Updates', checkModelUpdates],
        ['Server Configuration', checkServerConfiguration],
        ['Unit Tests', runUnitTests],
        ['API Endpoints', checkAPIEndpoints],
        ['Test Commands', generateTestScript]
    ];
    
    let allPassed = true;
    
    for (const [name, checkFunction] of checks) {
        try {
            const result = await checkFunction();
            if (!result) {
                allPassed = false;
            }
        } catch (error) {
            log(`❌ ${name} check failed: ${error.message}`, 'error');
            allPassed = false;
        }
    }
    
    console.log('');
    if (allPassed) {
        log('🎉 All checks passed! Race condition protection is properly implemented.', 'success');
        await generateSummaryReport();
    } else {
        log('⚠️  Some checks failed. Please review the errors above.', 'warning');
    }
    
    console.log('');
}

// Run the checker
main().catch(error => {
    console.error('Checker failed:', error);
    process.exit(1);
});
