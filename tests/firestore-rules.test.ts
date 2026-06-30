/**
 * Firestore security rules integration tests.
 *
 * Prerequisites:
 *   firebase emulators:start --only firestore
 *   (port 8080, as configured in firebase.json)
 *
 * Run: pnpm --filter=@ecohabit/tests test:rules
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, afterEach } from 'vitest';
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  collection, getDocs, query, where,
} from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

const RULES_PATH = resolve(__dirname, '../firestore.rules');

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'ecohabit-test',
    firestore: {
      rules: readFileSync(RULES_PATH, 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function authedUser(uid: string) {
  return testEnv.authenticatedContext(uid);
}

function adminUser(uid: string) {
  return testEnv.authenticatedContext(uid, { role: 'admin' });
}

function anonUser() {
  return testEnv.unauthenticatedContext();
}

// ── users ─────────────────────────────────────────────────────────────────────

describe('users collection', () => {
  it('authenticated user can read any user document', async () => {
    const alice = authedUser('alice');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'bob'), {
        displayName: 'Bob', email: 'bob@test.com', totalPoints: 100,
      });
    });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'users', 'bob')));
  });

  it('unauthenticated user cannot read users', async () => {
    await assertFails(getDoc(doc(anonUser().firestore(), 'users', 'bob')));
  });

  it('owner can create their own user document', async () => {
    const alice = authedUser('alice');
    await assertSucceeds(
      setDoc(doc(alice.firestore(), 'users', 'alice'), {
        displayName: 'Alice', email: 'alice@test.com',
      })
    );
  });

  it('user cannot create a document with a different uid', async () => {
    const alice = authedUser('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'users', 'bob'), {
        displayName: 'Impersonated Bob', email: 'bob@test.com',
      })
    );
  });

  it('user cannot create without required fields', async () => {
    const alice = authedUser('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'users', 'alice'), { displayName: 'Alice' })
    );
  });

  it('owner can update their own profile', async () => {
    const alice = authedUser('alice');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'alice'), {
        displayName: 'Alice', email: 'alice@test.com',
      });
    });
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'users', 'alice'), { displayName: 'Alice B' })
    );
  });

  it('user cannot update another user\'s profile', async () => {
    const alice = authedUser('alice');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'bob'), {
        displayName: 'Bob', email: 'bob@test.com',
      });
    });
    await assertFails(
      updateDoc(doc(alice.firestore(), 'users', 'bob'), { displayName: 'Hacked' })
    );
  });

  it('admin can update any user', async () => {
    const admin = adminUser('admin1');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'alice'), {
        displayName: 'Alice', email: 'alice@test.com',
      });
    });
    await assertSucceeds(
      updateDoc(doc(admin.firestore(), 'users', 'alice'), { banned: true })
    );
  });

  it('admin can delete a user', async () => {
    const admin = adminUser('admin1');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'alice'), {
        displayName: 'Alice', email: 'alice@test.com',
      });
    });
    await assertSucceeds(deleteDoc(doc(admin.firestore(), 'users', 'alice')));
  });

  it('non-admin cannot delete a user', async () => {
    const alice = authedUser('alice');
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', 'bob'), {
        displayName: 'Bob', email: 'bob@test.com',
      });
    });
    await assertFails(deleteDoc(doc(alice.firestore(), 'users', 'bob')));
  });
});

// ── habitLogs ─────────────────────────────────────────────────────────────────

describe('habitLogs collection', () => {
  const validLog = {
    userId: 'alice',
    wasteType: 'plastic',
    quantity: 5,
    pointsAwarded: 50,
    loggedAt: new Date().toISOString(),
  };

  it('unauthenticated can create a valid habit log (API route pattern)', async () => {
    const anon = anonUser();
    await assertSucceeds(addDoc(collection(anon.firestore(), 'habitLogs'), validLog));
  });

  it('create fails with invalid waste type', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'habitLogs'), {
        ...validLog, wasteType: 'nuclear_waste',
      })
    );
  });

  it('create fails with quantity > 100', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'habitLogs'), {
        ...validLog, quantity: 101,
      })
    );
  });

  it('create fails with pointsAwarded > 500', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'habitLogs'), {
        ...validLog, pointsAwarded: 501,
      })
    );
  });

  it('create fails with missing required fields', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'habitLogs'), { userId: 'alice', wasteType: 'plastic' })
    );
  });

  it('authenticated owner can read their own logs', async () => {
    const alice = authedUser('alice');
    let logId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'habitLogs'), validLog);
      logId = ref.id;
    });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'habitLogs', logId!)));
  });

  it('authenticated user cannot read another user\'s log', async () => {
    const bob = authedUser('bob');
    let logId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'habitLogs'), validLog);
      logId = ref.id;
    });
    await assertFails(getDoc(doc(bob.firestore(), 'habitLogs', logId!)));
  });

  it('owner can update their own log (edit within 24h)', async () => {
    const alice = authedUser('alice');
    let logId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'habitLogs'), validLog);
      logId = ref.id;
    });
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'habitLogs', logId!), { notes: 'Updated' })
    );
  });
});

// ── chatMessages ──────────────────────────────────────────────────────────────

describe('chatMessages collection', () => {
  it('owner can read their own chat messages', async () => {
    const alice = authedUser('alice');
    let msgId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'user', content: 'Hello',
      });
      msgId = ref.id;
    });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'chatMessages', msgId!)));
  });

  it('user cannot read another user\'s chat messages', async () => {
    const bob = authedUser('bob');
    let msgId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'user', content: 'Hello',
      });
      msgId = ref.id;
    });
    await assertFails(getDoc(doc(bob.firestore(), 'chatMessages', msgId!)));
  });

  it('create succeeds with valid fields (API route pattern)', async () => {
    const anon = anonUser();
    await assertSucceeds(
      addDoc(collection(anon.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'assistant', content: 'Great job recycling!',
      })
    );
  });

  it('create fails with invalid role', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'system', content: 'Injected prompt',
      })
    );
  });

  it('create fails when content exceeds 4000 chars', async () => {
    const anon = anonUser();
    await assertFails(
      addDoc(collection(anon.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'user', content: 'x'.repeat(4001),
      })
    );
  });

  it('messages cannot be updated', async () => {
    const alice = authedUser('alice');
    let msgId: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'chatMessages'), {
        userId: 'alice', role: 'user', content: 'Hello',
      });
      msgId = ref.id;
    });
    await assertFails(
      updateDoc(doc(alice.firestore(), 'chatMessages', msgId!), { content: 'Edited' })
    );
  });
});

// ── reflections ───────────────────────────────────────────────────────────────

describe('reflections collection', () => {
  it('owner can read their reflections', async () => {
    const alice = authedUser('alice');
    let id: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'reflections'), {
        userId: 'alice', mood: 4, note: 'Felt good', createdAt: new Date().toISOString(),
      });
      id = ref.id;
    });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'reflections', id!)));
  });

  it('user cannot read another user\'s reflections', async () => {
    const bob = authedUser('bob');
    let id: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'reflections'), {
        userId: 'alice', mood: 4, note: 'Felt good', createdAt: new Date().toISOString(),
      });
      id = ref.id;
    });
    await assertFails(getDoc(doc(bob.firestore(), 'reflections', id!)));
  });

  it('create fails with mood outside 1-5', async () => {
    await assertFails(
      addDoc(collection(anonUser().firestore(), 'reflections'), {
        userId: 'alice', mood: 6, note: 'Fine', createdAt: new Date().toISOString(),
      })
    );
  });

  it('create fails with note > 2000 chars', async () => {
    await assertFails(
      addDoc(collection(anonUser().firestore(), 'reflections'), {
        userId: 'alice', mood: 3, note: 'x'.repeat(2001), createdAt: new Date().toISOString(),
      })
    );
  });
});

// ── friendships ───────────────────────────────────────────────────────────────

describe('friendships collection', () => {
  it('participant can read their friendship', async () => {
    const alice = authedUser('alice');
    let id: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'friendships'), {
        userIds: ['alice', 'bob'], status: 'pending', requestedBy: 'alice',
      });
      id = ref.id;
    });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'friendships', id!)));
  });

  it('non-participant cannot read a friendship', async () => {
    const charlie = authedUser('charlie');
    let id: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'friendships'), {
        userIds: ['alice', 'bob'], status: 'pending', requestedBy: 'alice',
      });
      id = ref.id;
    });
    await assertFails(getDoc(doc(charlie.firestore(), 'friendships', id!)));
  });

  it('create succeeds with valid pending request', async () => {
    await assertSucceeds(
      addDoc(collection(anonUser().firestore(), 'friendships'), {
        userIds: ['alice', 'bob'], status: 'pending', requestedBy: 'alice',
      })
    );
  });

  it('create fails with non-pending status', async () => {
    await assertFails(
      addDoc(collection(anonUser().firestore(), 'friendships'), {
        userIds: ['alice', 'bob'], status: 'accepted', requestedBy: 'alice',
      })
    );
  });

  it('update can only change status and acceptedAt', async () => {
    let id: string;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'friendships'), {
        userIds: ['alice', 'bob'], status: 'pending', requestedBy: 'alice',
      });
      id = ref.id;
    });
    await assertSucceeds(
      updateDoc(doc(anonUser().firestore(), 'friendships', id!), {
        status: 'accepted', acceptedAt: new Date().toISOString(),
      })
    );
  });
});

// ── challenges ────────────────────────────────────────────────────────────────

describe('challenges collection', () => {
  it('anyone can read challenges', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await addDoc(collection(ctx.firestore(), 'challenges'), {
        title: 'Plastic Free Week', status: 'active',
      });
    });
    await assertSucceeds(
      getDocs(query(collection(anonUser().firestore(), 'challenges'), where('status', '==', 'active')))
    );
  });

  it('non-admin cannot create a challenge', async () => {
    const alice = authedUser('alice');
    await assertFails(
      addDoc(collection(alice.firestore(), 'challenges'), { title: 'Fake Challenge', status: 'active' })
    );
  });

  it('admin can create a challenge', async () => {
    const admin = adminUser('admin1');
    await assertSucceeds(
      addDoc(collection(admin.firestore(), 'challenges'), { title: 'Plastic Free Week', status: 'draft' })
    );
  });
});

// ── lessonOverrides ───────────────────────────────────────────────────────────

describe('lessonOverrides collection', () => {
  it('anyone can read lesson overrides', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'lessonOverrides', '1'), { title: 'Custom title' });
    });
    await assertSucceeds(getDoc(doc(anonUser().firestore(), 'lessonOverrides', '1')));
  });

  it('non-admin cannot write lesson overrides', async () => {
    const alice = authedUser('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'lessonOverrides', '1'), { title: 'Injected' })
    );
  });

  it('admin can write lesson overrides', async () => {
    const admin = adminUser('admin1');
    await assertSucceeds(
      setDoc(doc(admin.firestore(), 'lessonOverrides', '1'), { title: 'Updated lesson' })
    );
  });
});

// ── default deny ──────────────────────────────────────────────────────────────

describe('default deny', () => {
  it('cannot read an unlisted collection', async () => {
    await assertFails(
      getDoc(doc(authedUser('alice').firestore(), 'secretCollection', 'doc1'))
    );
  });

  it('cannot write an unlisted collection', async () => {
    await assertFails(
      setDoc(doc(authedUser('alice').firestore(), 'secretCollection', 'doc1'), { data: 'hacked' })
    );
  });
});
