
basePath = './';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/client/e2e/**/*.js'
];

reporters = ['progress','growl']

autoWatch = false;

browsers = ['PhantomJS'];

singleRun = true;

proxies = {
  '/': 'http://localhost:9001/'
};



