import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const repairedPaths = [
  'error-codes/aiper/aiper-robot-cleaners-ai-mapping-miss-ai-vision-or-mapping-misses-debris-coverage.html',
  'error-codes/aiper/aiper-robot-cleaners-app-hydrocomm-offline-aiper-app-hydrocomm-or-underwater-control-not-r.html',
  'error-codes/aiper/aiper-robot-cleaners-demo-display-unit-check-dealer-demo-unit-intake-check.html',
  'error-codes/connected-pool-network/automation-smart-backyard-ccei-vigi-alert-vigipool-remote-alert-or-chemistry-mismatch.html',
  'error-codes/hot-tubs-spas/spa-heat-swim-spa-covers-plunge-allin-proof-connected-cold-plunge-cooling-flow-or-app-aler.html',
  'error-codes/hot-tubs-spas/spa-packs-controllers-spa-gfci-immediate-breaker-trips-immediately-on-reset.html',
  'error-codes/pool-safety-monitoring/pool-cameras-smart-alarms-safety-cam-offline-safety-camera-alert-path-offline.html',
];

test('every previously broken generated page exists', () => {
  for (const relativePath of repairedPaths) {
    const absolutePath = path.join(root, relativePath);
    assert.equal(fs.existsSync(absolutePath), true, relativePath);
    assert.match(fs.readFileSync(absolutePath, 'utf8'), /<h1>/, relativePath);
  }
});

test('all repaired pool automation href targets exist', () => {
  const hub = fs.readFileSync(path.join(root, 'pool-automation', 'index.html'), 'utf8');
  for (const relativePath of repairedPaths.slice(3)) {
    assert.match(hub, new RegExp(relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('SendGrid alert payloads expose product routing metadata', () => {
  for (const relativePath of ['functions/api/subscribe.js', 'functions/api/event.js']) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(source, /product:\s*'splashlens'/);
    assert.match(source, /template_id:/);
    assert.match(source, /correlation_id:/);
  }
});
