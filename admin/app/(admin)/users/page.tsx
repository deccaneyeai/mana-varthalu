'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, []);

  const updateRole = async (uid: string, newRole: string) => {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">యూజర్లు</h1>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th className="telugu">పేరు</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="telugu">పాత్ర</th>
              <th className="telugu">జిల్లా</th>
              <th className="telugu">పాత్ర మార్చు</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td><span className="role-badge">{user.role}</span></td>
                <td>{user.location?.district || '-'}</td>
                <td>
                  <select
                    className="form-input" style={{ width: '140px', padding: '4px 8px', fontSize: '12px' }}
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="reporter">Reporter</option>
                    <option value="editor">Editor</option>
                    <option value="admanager">Ad Manager</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
