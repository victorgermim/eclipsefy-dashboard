try {
    const app = require('./src/app');
    console.log('App imported successfully');
} catch (error) {
    console.error('Import failed:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    process.exit(1);
}
