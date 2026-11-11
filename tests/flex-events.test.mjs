import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlexEventLedger,flexEventContract} from '../public/projects/flex-events.js';

const make = options => createFlexEventLedger({now:() => new Date('2026-10-20T20:00:00Z'),...options});
const names = ledger => ledger.snapshot().records.map(record => record.event);
const count = (ledger,event) => names(ledger).filter(name => name === event).length;

test('Registration requires a valid review and successful confirmation; retries keep one request and one outcome', () => {
  const ledger = make(); ledger.start('launch');
  assert.equal(ledger.confirm(),false);
  ledger.invalid(['name','email','private@example.com','Other secret']);
  assert.deepEqual(ledger.snapshot().records.at(-1).invalidFields,['name','email']);
  ledger.review('start'); const id = ledger.snapshot().current.id;
  assert.equal(count(ledger,'sample_registration_confirmed'),0);
  ledger.scenario('failure'); assert.equal(ledger.confirm(),false);
  ledger.scenario('success'); assert.equal(ledger.confirm(),true);
  assert.equal(ledger.snapshot().current.id,id);
  ledger.confirm(); ledger.revise(); ledger.review('fit'); ledger.confirm();
  assert.equal(count(ledger,'sample_registration_confirmed'),1);
  assert.equal(count(ledger,'sample_confirmation_reused'),2);
  const json = JSON.stringify(ledger.snapshot());
  assert.ok(!json.includes('private@example.com') && !json.includes('Other secret'));
  assert.ok(ledger.snapshot().records.every(record => record.realConversion === false && record.environment === 'portfolio_study'));
});

test('A selected time and Scale route do not qualify a request; both confirmation and an explicit review are required', () => {
  const ledger = make(); ledger.start('scale');
  assert.equal(ledger.qualification('met'),false);
  ledger.review('systems'); assert.equal(ledger.confirm(),false);
  assert.equal(ledger.confirm({slotSelected:true}),true);
  assert.equal(count(ledger,'sample_call_request_confirmed'),1);
  assert.equal(count(ledger,'sample_qualified_booking_confirmed'),0);
  ledger.qualification('met'); ledger.qualification('met'); ledger.confirm({slotSelected:true});
  assert.equal(count(ledger,'sample_qualified_booking_confirmed'),1);
  ledger.qualification('not_met');
  assert.equal(count(ledger,'sample_qualified_booking_revoked'),1);
  assert.equal(ledger.snapshot().current.qualified,false);
  ledger.qualification('met'); ledger.cancel();
  assert.equal(ledger.snapshot().current.qualified,false);
  assert.equal(ledger.confirm({slotSelected:true}),false);
  const before = ledger.snapshot().current.id;
  ledger.review('systems'); assert.notEqual(ledger.snapshot().current.id,before);
});

test('A reviewed sample still needs a successful booking; failures, existing requests and unavailable times add no conversion', () => {
  for (const scenario of ['failure','duplicate','unavailable']) {
    const ledger = make(); ledger.start('scale',scenario); ledger.review('systems'); ledger.qualification('met');
    ledger.confirm({slotSelected:true});
    assert.equal(count(ledger,'sample_call_request_confirmed'),0,scenario);
    assert.equal(count(ledger,'sample_qualified_booking_confirmed'),0,scenario);
    if (scenario === 'duplicate') {
      assert.equal(ledger.snapshot().current.existing,true);
      ledger.scenario('success'); ledger.confirm({slotSelected:true});
      assert.equal(count(ledger,'sample_call_request_confirmed'),0);
      assert.equal(count(ledger,'sample_qualified_booking_confirmed'),0);
    }
  }
  const ledger = make(); ledger.start('scale','unavailable'); ledger.review('systems'); ledger.notify();
  assert.ok(names(ledger).includes('sample_availability_notification_requested'));
  assert.equal(ledger.snapshot().current.confirmed,false);
});

test('Clearing or bounding a trace never resets conversion deduplication or makes returned records mutable', () => {
  const ledger = make({limit:3}); ledger.start('launch'); ledger.review('start'); ledger.confirm();
  ledger.clear(); ledger.confirm();
  assert.equal(count(ledger,'sample_registration_confirmed'),0);
  assert.equal(count(ledger,'sample_confirmation_reused'),1);
  for (let i=0;i<5;i++) ledger.invalid(['email']);
  const before = ledger.snapshot(); assert.equal(before.records.length,3);
  before.records[0].invalidFields.push('private input'); before.current.confirmed=false;
  assert.equal(ledger.snapshot().records[0].invalidFields.length,1);
  assert.equal(ledger.snapshot().current.confirmed,true);
  assert.ok(ledger.snapshot().records.every(record => flexEventContract.events[record.event]));
});
