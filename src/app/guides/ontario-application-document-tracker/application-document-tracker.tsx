'use client';

import { useMemo, useState } from 'react';

type Item = { label: string; owner: string; deadline: string; status: 'Not started' | 'Requested' | 'Received' | 'Submitted' };

const initial: Item[] = [
  { label: 'Official transcript', owner: '', deadline: '', status: 'Not started' },
  { label: 'Program-specific form', owner: '', deadline: '', status: 'Not started' },
  { label: 'Portfolio or audition', owner: '', deadline: '', status: 'Not started' },
  { label: 'Language test result', owner: '', deadline: '', status: 'Not started' },
  { label: 'Reference', owner: '', deadline: '', status: 'Not started' },
];

const statuses: Item['status'][] = ['Not started', 'Requested', 'Received', 'Submitted'];

export default function ApplicationDocumentTracker() {
  const [items, setItems] = useState<Item[]>(initial);
  const completed = useMemo(() => items.filter(item => item.status === 'Submitted').length, [items]);

  function update(index: number, key: keyof Item, value: string) {
    setItems(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } as Item : item));
  }

  return (
    <section className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="tracker-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="tracker-heading" className="text-2xl font-black text-slate-950">Build your document tracker</h2>
          <p className="mt-2 text-slate-600">Edit the sample rows. Nothing is uploaded or saved by this worksheet.</p>
        </div>
        <p className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900" role="status">{completed} of {items.length} marked submitted</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead><tr className="border-b border-slate-200"><th className="p-3">Document</th><th className="p-3">Who sends it?</th><th className="p-3">Deadline</th><th className="p-3">Status</th></tr></thead>
          <tbody>{items.map((item, index) => (
            <tr className="border-b border-slate-100" key={index}>
              <td className="p-2"><input aria-label={'Document ' + (index + 1)} className="w-full rounded-lg border border-slate-300 px-3 py-2" value={item.label} onChange={event => update(index, 'label', event.target.value)} /></td>
              <td className="p-2"><input aria-label={'Sender for ' + item.label} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="You, school, referee..." value={item.owner} onChange={event => update(index, 'owner', event.target.value)} /></td>
              <td className="p-2"><input aria-label={'Deadline for ' + item.label} className="w-full rounded-lg border border-slate-300 px-3 py-2" type="date" value={item.deadline} onChange={event => update(index, 'deadline', event.target.value)} /></td>
              <td className="p-2"><select aria-label={'Status for ' + item.label} className="w-full rounded-lg border border-slate-300 px-3 py-2" value={item.status} onChange={event => update(index, 'status', event.target.value)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-xl bg-blue-700 px-4 py-2 font-bold text-white" type="button" onClick={() => setItems(current => [...current, { label: 'Other document', owner: '', deadline: '', status: 'Not started' }])}>Add a row</button>
        <button className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-800" type="button" onClick={() => setItems(initial)}>Reset worksheet</button>
      </div>
    </section>
  );
}
