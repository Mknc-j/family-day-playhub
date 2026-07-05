import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language";
import { useEventData } from "@/hooks/useEventData";
import { isOperator, setOperator } from "@/lib/storage";
import {
  computeLeaderboard,
  computeStations,
  getSetting,
  setSetting,
  downloadCsv,
  findPlayerByNumber,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Operator = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { players, games, scores, reload } = useEventData();
  const [submissionsOpen, setSubmissionsOpen] = useState(true);
  const [resetText, setResetText] = useState("");
  const [manual, setManual] = useState({ playerNumber: "", gameId: "password-challenge", score: "", maxScore: "100" });

  useEffect(() => {
    if (!isOperator()) navigate("/operator-login");
    getSetting<boolean>("submissions_open").then((v) => setSubmissionsOpen(v !== false));
  }, [navigate]);

  const leaderboard = computeLeaderboard(players, games, scores);
  const stationRows = computeStations(players, games, scores);
  const activeGames = games.filter((g) => g.active);
  const completionRate =
    stationRows.length && activeGames.length
      ? Math.round((stationRows.reduce((a, r) => a + r.completedCount, 0) / (stationRows.length * activeGames.length)) * 100)
      : 0;

  const gameTitle = (id: string) => {
    const g = games.find((x) => x.id === id);
    return g ? (lang === "ja" ? g.title_ja : g.title_en) : id;
  };

  const toggleSubmissions = async () => {
    const nv = !submissionsOpen;
    await setSetting("submissions_open", nv);
    setSubmissionsOpen(nv);
    toast.success(t("saved"));
  };

  const resetPlayerScores = async (playerId: string) => {
    await supabase.from("scores").delete().eq("player_id", playerId);
    toast.success(t("saved"));
    reload();
  };
  const deletePlayer = async (playerId: string) => {
    await supabase.from("players").delete().eq("id", playerId);
    toast.success(t("deleted"));
    reload();
  };
  const deleteScore = async (id: string) => {
    await supabase.from("scores").delete().eq("id", id);
    toast.success(t("deleted"));
    reload();
  };

  const addManualScore = async () => {
    const player = await findPlayerByNumber(manual.playerNumber);
    if (!player) return toast.error(t("playerNotFound"));
    const sc = Number(manual.score);
    const mx = Number(manual.maxScore);
    if (isNaN(sc) || sc < 0 || sc > mx) return toast.error(t("invalidScore"));
    await supabase.from("scores").insert({
      player_id: player.id, player_number: player.player_number, game_id: manual.gameId,
      score: sc, max_score: mx, source: "operator-manual-entry",
    });
    toast.success(t("saved"));
    setManual({ ...manual, playerNumber: "", score: "" });
    reload();
  };

  const exportPlayers = () =>
    downloadCsv("players.csv", [
      ["player_number", "name", "age", "language", "created_at"],
      ...players.map((p) => [p.player_number, p.name, p.age, p.language, p.created_at]),
    ]);
  const exportScores = () =>
    downloadCsv("scores.csv", [
      ["player_number", "game_id", "score", "max_score", "source", "created_at"],
      ...scores.map((s) => [s.player_number, s.game_id, s.score, s.max_score, s.source, s.created_at]),
    ]);
  const exportLeaderboard = () =>
    downloadCsv("leaderboard.csv", [
      ["rank", "player_number", "name", "age", "total_score", "games_completed", "average_percentage"],
      ...leaderboard.map((r, i) => [i + 1, r.player_number, r.name, r.age, r.total_score, r.games_completed, r.average_percentage]),
    ]);

  const resetTestScores = async () => {
    await supabase.from("scores").delete().in("source", ["operator-manual-entry", "operator-edit"]);
    toast.success(t("deleted"));
    setResetText("");
    reload();
  };
  const resetFull = async () => {
    await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("players").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    toast.success(t("deleted"));
    setResetText("");
    reload();
  };

  const logout = () => {
    setOperator(false);
    navigate("/operator-login");
  };

  const stat = (label: string, value: string | number) => (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-extrabold text-primary">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-extrabold">{t("operatorDashboard")}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button size="sm" variant="outline" onClick={logout}>{t("logout")}</Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex w-full flex-wrap">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t("leaderboard")}</TabsTrigger>
            <TabsTrigger value="stations">{t("stations")}</TabsTrigger>
            <TabsTrigger value="players">{t("players")}</TabsTrigger>
            <TabsTrigger value="scores">{t("scores")}</TabsTrigger>
            <TabsTrigger value="controls">{t("eventControls")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stat(t("registeredPlayers"), players.length)}
              {stat(t("totalSubmissions"), scores.length)}
              {stat(t("activeGames"), activeGames.length)}
              {stat(t("completionRate"), `${completionRate}%`)}
              {stat(t("submissionsStatus"), submissionsOpen ? t("open") : t("closed"))}
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <p className="mb-3 font-bold">{t("quickLinks")}</p>
              <div className="flex flex-wrap gap-2">
                {[["/", t("home")], ["/games", t("gameStations")], ["/leaderboard", t("leaderboard")], ["/stations", t("stationStatus")],
                  ...games.map((g) => [g.route, `${t("station")} ${g.station_number}`] as [string, string])].map(([to, label]) => (
                  <Button key={to} asChild size="sm" variant="outline"><Link to={to as string}>{label}</Link></Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="p-3">{t("rank")}</th><th className="p-3">{t("playerNumber")}</th>
                    <th className="p-3">{t("name")}</th><th className="p-3">{t("age")}</th>
                    <th className="p-3">{t("totalScore")}</th><th className="p-3">{t("gamesCompleted")}</th>
                    <th className="p-3">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((r, i) => (
                    <tr key={r.player_id} className="border-t">
                      <td className="p-3 font-bold">{i + 1}</td><td className="p-3">{r.player_number}</td>
                      <td className="p-3">{r.name}</td><td className="p-3">{r.age}</td>
                      <td className="p-3 font-bold text-primary">{r.total_score}</td><td className="p-3">{r.games_completed}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => resetPlayerScores(r.player_id)}>{t("resetPlayerScores")}</Button>
                          <ConfirmDelete label={t("deletePlayer")} onConfirm={() => deletePlayer(r.player_id)} t={t} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="stations">
            <div className="space-y-2">
              {stationRows.map((r) => (
                <div key={r.player_id} className="rounded-2xl border bg-card p-3 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name} <span className="text-muted-foreground">{r.player_number}</span></span>
                    <span className="font-bold">{r.completedCount}/{r.totalActive}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {activeGames.map((g) => (
                      <span key={g.id} className={`rounded px-2 py-1 text-xs font-medium ${r.completed[g.id] ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{g.station_number}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="players">
            <PlayersTab players={players} reload={reload} t={t} />
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <p className="mb-3 font-bold">{t("addScore")}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="1" value={manual.playerNumber} onChange={(e) => setManual({ ...manual, playerNumber: e.target.value })} className="h-11" />
                <select className="h-11 rounded-md border bg-background px-3" value={manual.gameId} onChange={(e) => setManual({ ...manual, gameId: e.target.value })}>
                  {games.map((g) => <option key={g.id} value={g.id}>{gameTitle(g.id)}</option>)}
                </select>
                <Input type="number" placeholder={t("score")} value={manual.score} onChange={(e) => setManual({ ...manual, score: e.target.value })} className="h-11" />
                <Input type="number" placeholder={t("maxScore")} value={manual.maxScore} onChange={(e) => setManual({ ...manual, maxScore: e.target.value })} className="h-11" />
              </div>
              <Button onClick={addManualScore} className="mt-3 h-11 w-full font-semibold">{t("addScore")}</Button>
            </div>
            <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left"><tr>
                  <th className="p-3">{t("playerNumber")}</th><th className="p-3">{t("game")}</th>
                  <th className="p-3">{t("score")}</th><th className="p-3">{t("source")}</th><th className="p-3">{t("actions")}</th>
                </tr></thead>
                <tbody>
                  {scores.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-3">{s.player_number}</td><td className="p-3">{gameTitle(s.game_id)}</td>
                      <td className="p-3 font-semibold">{s.score}/{s.max_score}</td><td className="p-3 text-xs">{s.source}</td>
                      <td className="p-3"><ConfirmDelete label={t("delete")} onConfirm={() => deleteScore(s.id)} t={t} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t("toggleSubmissions")}</span>
                <Button onClick={toggleSubmissions} variant={submissionsOpen ? "default" : "secondary"}>
                  {submissionsOpen ? t("open") : t("closed")}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportPlayers}>{t("exportPlayers")}</Button>
              <Button variant="outline" onClick={exportScores}>{t("exportScores")}</Button>
              <Button variant="outline" onClick={exportLeaderboard}>{t("exportLeaderboard")}</Button>
            </div>
            <div className="rounded-2xl border-2 border-destructive/40 bg-destructive/5 p-4">
              <p className="mb-2 font-bold text-destructive">{t("dangerZone")}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full font-semibold sm:w-auto">
                    {t("resetAllData")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("resetAllData")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("resetAllDataDesc")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={resetFull}>{t("confirm")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="mt-4 border-t border-destructive/20 pt-4">
                <Label>{t("typeReset")}</Label>
                <Input value={resetText} onChange={(e) => setResetText(e.target.value)} placeholder="RESET" className="mt-1 h-11" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="destructive" disabled={resetText !== "RESET"} onClick={resetTestScores}>{t("resetTestScores")}</Button>
                  <Button variant="destructive" disabled={resetText !== "RESET"} onClick={resetFull}>{t("resetFull")}</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function ConfirmDelete({ label, onConfirm, t }: { label: string; onConfirm: () => void; t: (k: string) => string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button size="sm" variant="destructive">{label}</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirm")}</AlertDialogTitle>
          <AlertDialogDescription>{t("confirmDelete")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t("confirm")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PlayersTab({ players, reload, t }: { players: import("@/lib/types").Player[]; reload: () => void; t: (k: string) => string }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", age: "", language: "en" });
  const filtered = players.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.player_number.toLowerCase().includes(q.toLowerCase()));

  const startEdit = (p: import("@/lib/types").Player) => {
    setEditing(p.id);
    setForm({ name: p.name, age: String(p.age), language: p.language });
  };
  const save = async (id: string) => {
    await supabase.from("players").update({ name: form.name, age: Number(form.age), language: form.language }).eq("id", id);
    toast.success(t("saved"));
    setEditing(null);
    reload();
  };
  const del = async (id: string) => {
    await supabase.from("players").delete().eq("id", id);
    toast.success(t("deleted"));
    reload();
  };

  return (
    <div className="space-y-3">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="h-11" />
      {filtered.map((p) => (
        <div key={p.id} className="rounded-2xl border bg-card p-3 shadow-card">
          {editing === p.id ? (
            <div className="space-y-2">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10" />
              <div className="flex gap-2">
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="h-10" />
                <select className="h-10 rounded-md border bg-background px-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  <option value="en">EN</option><option value="ja">日本語</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save(p.id)}>{t("save")}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>{t("cancel")}</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span><b>{p.name}</b> · {p.player_number} · {p.age} · {p.language}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>{t("edit")}</Button>
                <ConfirmDelete label={t("delete")} onConfirm={() => del(p.id)} t={t} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Operator;
