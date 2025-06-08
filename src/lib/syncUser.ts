export async function syncUser({ firebaseUid, email, name }: { firebaseUid: string, email: string, name?: string }) {
  const res = await fetch('/api/user/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebaseUid, email, name }),
  });
  if (!res.ok) {
    throw new Error('Failed to sync user');
  }
  return res.json();
} 