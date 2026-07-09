import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { speakerLogin, speakerToken, getMe, saveMe, uploadPhoto } from '../lib/api';
import { SPEAKER_TYPES } from '../data/speakerTypes';

const EMPTY = { firstName: '', lastName: '', title: '', company: '', country: '', bio: '', expertise: [] as string[], photoUrl: '', linkedin: '', type: 'Founder', year: 2026 };

export function SpeakerPortal() {
  const { token = '' } = useParams();
  const [authed, setAuthed] = useState(!!speakerToken());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(EMPTY);
  const [hasPending, setHasPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (authed) getMe().then((d) => { if (d.profile) setProfile({ ...EMPTY, ...d.profile }); setHasPending(d.hasPending); }).catch(() => setAuthed(false)); }, [authed]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try { await speakerLogin(token, password); setAuthed(true); }
    catch { setError('Incorrect password.'); }
  };
  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }));
  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); try { set('photoUrl', await uploadPhoto(f)); } finally { setBusy(false); }
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await saveMe({ ...profile, expertise: profile.expertise, year: Number(profile.year) }); setSaved(true); setHasPending(true); }
    catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  if (!authed) return (
    <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: 'Inter, sans-serif' }}>
      <h2>Speaker Portal</h2>
      <form onSubmit={login}>
        <input type="password" placeholder="Password from your email" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, margin: '12px 0' }} />
        <button type="submit" style={{ padding: '10px 18px' }}>Enter</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '48px auto', fontFamily: 'Inter, sans-serif', padding: 16 }}>
      <h2>Your Speaker Profile</h2>
      {hasPending && <p style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: 10 }}>Changes are awaiting admin approval.</p>}
      <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="First name" value={profile.firstName} onChange={(e) => set('firstName', e.target.value)} />
        <input placeholder="Last name" value={profile.lastName} onChange={(e) => set('lastName', e.target.value)} />
        <input placeholder="Title" value={profile.title} onChange={(e) => set('title', e.target.value)} />
        <input placeholder="Company" value={profile.company} onChange={(e) => set('company', e.target.value)} />
        <input placeholder="Country" value={profile.country} onChange={(e) => set('country', e.target.value)} />
        <input placeholder="LinkedIn URL" value={profile.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
        <select value={profile.type} onChange={(e) => set('type', e.target.value)}>
          {SPEAKER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Year" type="number" value={profile.year} onChange={(e) => set('year', e.target.value)} />
        <input placeholder="Expertise (comma separated)" value={profile.expertise.join(', ')} onChange={(e) => set('expertise', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        <textarea placeholder="Bio" value={profile.bio} onChange={(e) => set('bio', e.target.value)} rows={5} />
        <div>
          {profile.photoUrl && <img src={profile.photoUrl} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />}
          <input type="file" accept="image/*" onChange={onPhoto} />
        </div>
        <button type="submit" disabled={busy}>{busy ? 'Working...' : 'Save (pending admin approval)'}</button>
        {saved && <p style={{ color: 'green' }}>Saved. Awaiting admin approval.</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
