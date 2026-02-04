import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CircularProgress from "@/components/CircularProgress";
import { Activity, LogOut, User, Target, Calendar, Dumbbell, Plane, Trophy } from "lucide-react";

interface PlayerData {
  playerName: string;
  age: string;
  playerRole: string;
  playerType: string;
  bmi: string;
  matchesLastWeek: string;
  matchesLastMonth: string;
  ballsFacedLastMatch: string;
  acuteWorkload: string;
  chronicWorkload: string;
  injuriesLast30Days: string;
  restDays: string;
  travelLoad: string;
  matchFormat: string;
}

const initialPlayerData: PlayerData = {
  playerName: "",
  age: "",
  playerRole: "",
  playerType: "",
  bmi: "",
  matchesLastWeek: "",
  matchesLastMonth: "",
  ballsFacedLastMatch: "",
  acuteWorkload: "",
  chronicWorkload: "",
  injuriesLast30Days: "",
  restDays: "",
  travelLoad: "",
  matchFormat: "",
};

const Dashboard = () => {
  const [playerData, setPlayerData] = useState<PlayerData>(initialPlayerData);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (field: keyof PlayerData, value: string) => {
    setPlayerData({ ...playerData, [field]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setShowResult(false);

    try {
      const { apiService } = await import('@/services/api');
      const predictionData = {
        age: parseInt(playerData.age),
        playerRole: playerData.playerRole.charAt(0).toUpperCase() + playerData.playerRole.slice(1),
        playerType: playerData.playerType.charAt(0).toUpperCase() + playerData.playerType.slice(1),
        bmi: parseFloat(playerData.bmi),
        matchesLastWeek: parseInt(playerData.matchesLastWeek),
        matchesLastMonth: parseInt(playerData.matchesLastMonth),
        ballsFacedLastMatch: parseInt(playerData.ballsFacedLastMatch),
        acuteWorkload: parseFloat(playerData.acuteWorkload),
        chronicWorkload: parseFloat(playerData.chronicWorkload),
        injuriesLast30d: parseInt(playerData.injuriesLast30Days),
        restDays: parseInt(playerData.restDays),
        travelLoad: playerData.travelLoad.charAt(0).toUpperCase() + playerData.travelLoad.slice(1),
        matchFormat: playerData.matchFormat.toUpperCase()
      };
      
      const response = await apiService.predict(predictionData);
      setPrediction(response.injuryRisk);
      setShowResult(true);
      
      toast({
        title: "Prediction Complete",
        description: `Injury probability calculated for ${playerData.playerName || "Player"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Prediction failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setPlayerData(initialPlayerData);
    setPrediction(null);
    setShowResult(false);
  };

  const getBackgroundClass = () => {
    if (!showResult || prediction === null) return "";
    if (prediction < 50) return "bg-success-light";
    if (prediction <= 80) return "bg-warning-light";
    return "bg-danger-light";
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${getBackgroundClass()}`}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">Cricket Injury Predictor</h1>
                <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Player Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePredict} className="space-y-6">
                  {/* Player Name */}
                  <div className="space-y-2">
                    <Label className="form-label">Player Name</Label>
                    <Input
                      placeholder="Enter player name"
                      value={playerData.playerName}
                      onChange={(e) => handleInputChange("playerName", e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="form-label">Age (16-45)</Label>
                      <Input
                        type="number"
                        min="16"
                        max="45"
                        placeholder="Age"
                        value={playerData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="form-label">Player Role</Label>
                      <Select
                        value={playerData.playerRole}
                        onValueChange={(value) => handleInputChange("playerRole", value)}
                        required
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Batsman">Batsman</SelectItem>
                          <SelectItem value="Bowler">Bowler</SelectItem>
                          <SelectItem value="All-rounder">All-rounder</SelectItem>
                          <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="form-label">Player Type</Label>
                      <Select
                        value={playerData.playerType}
                        onValueChange={(value) => handleInputChange("playerType", value)}
                        required
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                          <SelectItem value="Smooth">Smooth</SelectItem>
                          <SelectItem value="Numb">Numb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="form-label">BMI (16.0-35.0)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="16"
                        max="35"
                        placeholder="BMI"
                        value={playerData.bmi}
                        onChange={(e) => handleInputChange("bmi", e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="form-label">Match Format</Label>
                      <Select
                        value={playerData.matchFormat}
                        onValueChange={(value) => handleInputChange("matchFormat", value)}
                        required
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Test">Test</SelectItem>
                          <SelectItem value="ODI">ODI</SelectItem>
                          <SelectItem value="T20">T20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="form-label">Travel Load</Label>
                      <Select
                        value={playerData.travelLoad}
                        onValueChange={(value) => handleInputChange("travelLoad", value)}
                        required
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select travel load" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low (Same city)</SelectItem>
                          <SelectItem value="Medium">Medium (Domestic)</SelectItem>
                          <SelectItem value="High">High (International)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Match Statistics */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-primary" />
                      Match Statistics
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="form-label">Matches (Last Week)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="7"
                          placeholder="0-7"
                          value={playerData.matchesLastWeek}
                          onChange={(e) => handleInputChange("matchesLastWeek", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="form-label">Matches (Last Month)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          placeholder="0-30"
                          value={playerData.matchesLastMonth}
                          onChange={(e) => handleInputChange("matchesLastMonth", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="form-label">Balls Faced (Last Match)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="300"
                          placeholder="0-300"
                          value={playerData.ballsFacedLastMatch}
                          onChange={(e) => handleInputChange("ballsFacedLastMatch", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Workload Data */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-4">
                      <Dumbbell className="w-4 h-4 text-primary" />
                      Workload & Recovery
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="form-label">Acute Workload (7 days)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Score"
                          value={playerData.acuteWorkload}
                          onChange={(e) => handleInputChange("acuteWorkload", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="form-label">Chronic Workload (30 days)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Score"
                          value={playerData.chronicWorkload}
                          onChange={(e) => handleInputChange("chronicWorkload", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="form-label">Injuries (Last 30 Days)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          placeholder="0-5"
                          value={playerData.injuriesLast30Days}
                          onChange={(e) => handleInputChange("injuriesLast30Days", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="form-label">Rest Days</Label>
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          placeholder="0-30"
                          value={playerData.restDays}
                          onChange={(e) => handleInputChange("restDays", e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 btn-primary h-12 font-semibold text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        <>
                          <Target className="w-5 h-5 mr-2" />
                          Predict Injury Risk
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="px-6 h-12"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Prediction Result
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 border-4 border-muted border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Analyzing player data...</p>
                  </div>
                ) : showResult && prediction !== null ? (
                  <div className="animate-fade-in">
                    <CircularProgress percentage={prediction} />
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Injury probability for
                      </p>
                      <p className="font-semibold text-lg">
                        {playerData.playerName || "Player"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <Target className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <p>Fill in the player data and click</p>
                    <p className="font-medium">Predict Injury Risk</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
