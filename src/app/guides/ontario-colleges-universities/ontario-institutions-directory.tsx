"use client";

import { useMemo, useState } from "react";

type InstitutionType = "University" | "College";
type Institution = { name: string; type: InstitutionType };

const institutions: Institution[] = [
  { name: "Algoma University", type: "University" },
  { name: "Brock University", type: "University" },
  { name: "Carleton University", type: "University" },
  { name: "Lakehead University", type: "University" },
  { name: "Laurentian University", type: "University" },
  { name: "McMaster University", type: "University" },
  { name: "Nipissing University", type: "University" },
  { name: "NOSM University", type: "University" },
  { name: "OCAD University", type: "University" },
  { name: "Ontario Tech University", type: "University" },
  { name: "Queen's University", type: "University" },
  { name: "Toronto Metropolitan University", type: "University" },
  { name: "Trent University", type: "University" },
  { name: "Université de Hearst", type: "University" },
  { name: "Université de l'Ontario français", type: "University" },
  { name: "University of Guelph", type: "University" },
  { name: "University of Ottawa", type: "University" },
  { name: "University of Toronto", type: "University" },
  { name: "University of Waterloo", type: "University" },
  { name: "University of Windsor", type: "University" },
  { name: "Western University", type: "University" },
  { name: "Wilfrid Laurier University", type: "University" },
  { name: "York University", type: "University" },
  { name: "Algonquin College", type: "College" },
  { name: "Cambrian College", type: "College" },
  { name: "Canadore College", type: "College" },
  { name: "Centennial College", type: "College" },
  { name: "Collège Boréal", type: "College" },
  { name: "Conestoga College", type: "College" },
  { name: "Confederation College", type: "College" },
  { name: "Durham College", type: "College" },
  { name: "Fanshawe College", type: "College" },
  { name: "George Brown College", type: "College" },
  { name: "Georgian College", type: "College" },
  { name: "Humber Polytechnic", type: "College" },
  { name: "La Cité", type: "College" },
  { name: "Lambton College", type: "College" },
  { name: "Loyalist College", type: "College" },
  { name: "Mohawk College", type: "College" },
  { name: "Niagara College", type: "College" },
  { name: "Northern College", type: "College" },
  { name: "Sault College", type: "College" },
  { name: "Seneca Polytechnic", type: "College" },
  { name: "Sheridan College", type: "College" },
  { name: "St. Clair College", type: "College" },
  { name: "St. Lawrence College", type: "College" },
  { name: "Fleming College", type: "College" }
];

export default function OntarioInstitutionsDirectory() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | InstitutionType>("All");
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("en-CA");
    return institutions.filter((institution) =>
      (type === "All" || institution.type === type) &&
      (!normalized || institution.name.toLocaleLowerCase("en-CA").includes(normalized))
    );
  }, [query, type]);

  return (
    <section aria-labelledby="directory-heading" className="mt-10">
      <h2 id="directory-heading" className="text-2xl font-black text-slate-950 dark:text-white">
        Search the official institution list
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Search by institution name or narrow the list by type. This list does not rank schools or programs.
      </p>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="font-bold text-sm">
            Institution name
            <input
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Windsor, Humber or Ottawa"
              type="search"
            />
          </label>
          <fieldset>
            <legend className="font-bold text-sm">Institution type</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["All", "University", "College"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={type === option}
                  onClick={() => setType(option)}
                  className={"rounded-full border px-4 py-2 text-sm font-bold " + (
                    type === option
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <p className="mt-5 text-sm font-bold" aria-live="polite">
          {matches.length} {matches.length === 1 ? "institution" : "institutions"} shown
        </p>
        {matches.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {matches.map((institution) => (
              <li key={institution.name} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <strong className="text-slate-950 dark:text-white">{institution.name}</strong>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  {institution.type}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
            No institution name matches this search. Try a shorter name or select All.
          </p>
        )}
      </div>
    </section>
  );
}
