"use client";

import { useEffect, useState } from "react";
import { T, I } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { DashShell, EmptyState } from "@/components/rh/dash-shell";
import { Card, Button, Field, Input } from "@/components/rh/ui";
import { apiGet, apiPatch, API_BASE } from "@/lib/rh/api";

interface InspectionJob {
  id: string;
  status: "REQUESTED" | "ACCEPTED" | "COMPLETED" | "EXPIRED";
  expiresAt: string;
  notes: string | null;
  videoLink: string | null;
  property: {
    id: string; title: string; description: string;
    images: string[]; distanceToCampus: number | null;
    location: { name: string } | null;
  } | null;
  student: { id: string; name: string; email: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: T.gold ?? "#C99500",
  ACCEPTED: T.blue ?? "#2B5278",
  COMPLETED: T.green,
  EXPIRED: T.ink3,
};

function timeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function JobPropertyPreview({ job, mobile }: { job: InspectionJob; mobile: boolean }) {
  const { go } = useApp();
  const p = job.property;
  const firstImage = Array.isArray(p?.images) ? p.images[0] : null;

  return (
    <div style={{ display: "flex", gap: 0, flexDirection: mobile ? "column" : "row" }}>
      {/* Photo */}
      <div style={{ width: mobile ? "100%" : 160, height: mobile ? 160 : "auto", flexShrink: 0, position: "relative", overflow: "hidden", background: T.paper2 }}>
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstImage} alt={p?.title ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", minHeight: 120, background: `linear-gradient(135deg, ${T.clay}22, ${T.clay}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {I.building({ width: 32, height: 32, style: { color: T.clay, opacity: 0.5 } })}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, padding: mobile ? "16px 16px 0" : "18px 20px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, color: T.ink }}>{p?.title ?? "—"}</div>
          <span
            onClick={() => p?.id && go("property", p.id)}
            style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.clay, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            View listing →
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
          {p?.location?.name && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: T.sans, fontSize: 12.5, color: T.ink2 }}>
              {I.pin({ width: 12, height: 12 })} {p.location.name}
            </span>
          )}
          {p?.distanceToCampus != null && (
            <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2 }}>
              · {Number(p.distanceToCampus).toFixed(1)} km from campus
            </span>
          )}
        </div>

        {p?.description && (
          <p style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 8, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {p.description}
          </p>
        )}

        {/* Thumbnail strip for extra images */}
        {Array.isArray(p?.images) && p.images.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, overflow: "hidden" }}>
            {p.images.slice(1, 5).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", border: "1px solid " + T.line, flexShrink: 0 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompleteModal({
  job,
  onClose,
  onDone,
}: {
  job: InspectionJob;
  onClose: () => void;
  onDone: (updated: InspectionJob) => void;
}) {
  const { mobile } = useViewport();
  const [videoLink, setVideoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!videoLink.trim()) { setError("Paste your Google Drive video link."); return; }
    setBusy(true);
    try {
      const result = await apiPatch<InspectionJob>(`/api/inspections/${job.id}`, {
        action: "complete",
        videoLink: videoLink.trim(),
        notes: notes.trim() || undefined,
      });
      onDone(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(33,29,24,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center", padding: mobile ? 0 : 24 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: T.paper, borderRadius: mobile ? "20px 20px 0 0" : 20, width: "100%", maxWidth: 520, padding: mobile ? "28px 22px 36px" : 36 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 24, fontWeight: 500, color: T.ink }}>Submit inspection</h2>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 20, height: 20 })}</span>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{job.property?.title ?? "—"}</div>
          <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 2 }}>{job.property?.location?.name ?? ""} · Student: {job.student?.name ?? "—"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field
            label="Google Drive video link"
            hint="Upload the inspection video to Google Drive, set sharing to 'Anyone with the link', then paste the link here."
          >
            <Input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/…"
            />
          </Field>

          <Field label="Notes (optional)" hint="Anything the student or admin should know about the property condition.">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Water pressure is low, landlord confirmed it's being fixed."
              rows={3}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 13px", borderRadius: 10, border: `1.5px solid ${T.line}`, fontFamily: T.sans, fontSize: 14, color: T.ink, background: "#fff", resize: "vertical", outline: "none" }}
            />
          </Field>
        </div>

        {error && (
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px", marginTop: 14 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button full size="lg" disabled={busy} onClick={submit}>
            {busy ? "Submitting…" : "Submit inspection"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InspectorDashboard() {
  const { user, showToast } = useApp();
  const { mobile } = useViewport();
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState<InspectionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<InspectionJob | null>(null);

  useEffect(() => {
    setLoading(true);
    apiGet<InspectionJob[]>("/api/inspections")
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const accept = async (job: InspectionJob) => {
    try {
      const updated = await apiPatch<InspectionJob>(`/api/inspections/${job.id}`, { action: "accept" });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
      showToast("Job accepted — complete it within 24 hours.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not accept job.");
    }
  };

  const onCompleted = (updated: InspectionJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setCompleting(null);
    showToast("Inspection submitted successfully.");
  };

  const active = jobs.filter((j) => j.status === "ACCEPTED");
  const open = jobs.filter((j) => j.status === "REQUESTED");
  const done = jobs.filter((j) => j.status === "COMPLETED" || j.status === "EXPIRED");

  return (
    <>
      <DashShell
        role="inspector"
        tab={tab}
        setTab={setTab}
        title="Inspector workspace"
        subtitle={`Welcome, ${user?.name?.split(" ")[0] ?? "Inspector"}`}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 64, color: T.ink3 }}>
            {I.clock({ width: 28, height: 28 })}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState icon={I.search} title="No inspection jobs yet" sub="Requested inspections from students will appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Active jobs — accepted, clock is ticking */}
            {active.length > 0 && (
              <section>
                <h3 style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: T.ink3, margin: "0 0 12px" }}>
                  Active ({active.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {active.map((job) => (
                    <Card key={job.id} pad={0} style={{ overflow: "hidden" }}>
                      <JobPropertyPreview job={job} mobile={mobile} />
                      <div style={{ padding: mobile ? "14px 16px" : "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.red, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                          {I.clock({ width: 12, height: 12 })} {timeLeft(job.expiresAt)}
                          {job.student?.name && <span style={{ color: T.ink3, fontWeight: 400 }}>· Student: {job.student.name}</span>}
                        </div>
                        <Button size="sm" onClick={() => setCompleting(job)}>Submit video link</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Open jobs — available to accept */}
            {open.length > 0 && (
              <section>
                <h3 style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: T.ink3, margin: "0 0 12px" }}>
                  Available jobs ({open.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {open.map((job) => (
                    <Card key={job.id} pad={0} style={{ overflow: "hidden" }}>
                      <JobPropertyPreview job={job} mobile={mobile} />
                      <div style={{ padding: mobile ? "14px 16px" : "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3 }}>
                          Expires {timeLeft(job.expiresAt)}
                        </div>
                        <Button size="sm" onClick={() => accept(job)}>Accept job</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* History */}
            {done.length > 0 && (
              <section>
                <h3 style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: T.ink3, margin: "0 0 12px" }}>
                  History
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {done.map((job) => (
                    <Card key={job.id} pad={mobile ? 16 : 20}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.ink }}>{job.property?.title ?? "—"}</div>
                          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 3 }}>
                            {job.property?.location?.name ?? ""} · {job.student?.name ?? ""}
                          </div>
                          {job.videoLink && (
                            <a href={job.videoLink} target="_blank" rel="noopener noreferrer"
                              style={{ fontFamily: T.sans, fontSize: 12.5, color: T.clay, fontWeight: 600, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              {I.arrow({ width: 12, height: 12 })} View video
                            </a>
                          )}
                        </div>
                        <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: STATUS_COLORS[job.status] ?? T.ink3, background: T.paper, padding: "4px 10px", borderRadius: 999 }}>
                          {job.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </DashShell>

      {completing && (
        <CompleteModal
          job={completing}
          onClose={() => setCompleting(null)}
          onDone={onCompleted}
        />
      )}
    </>
  );
}
