import React, { useState, useEffect, useRef } from 'react';
import { InfographicProject, Scene, ThemeId, AspectRatio, ChartType, TransitionType } from './types';
import { PRESET_PROJECTS } from './data/presets';
import { THEMES } from './styles/themes';
import { StudioHeader } from './components/studio/StudioHeader';
import { StoryboardSidebar } from './components/studio/StoryboardSidebar';
import { CanvasStage } from './components/stage/CanvasStage';
import { TimelineBar } from './components/studio/TimelineBar';
import { InspectorPanel } from './components/studio/InspectorPanel';
import { PresenterModal } from './components/presentation/PresenterModal';
import { soundEffects } from './services/soundEffects';

export function App() {
  // Main Project State initialized with Business deck preset
  const [project, setProject] = useState<InfographicProject>(PRESET_PROJECTS.business);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Playback & Animation Engine State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isPresenterOpen, setIsPresenterOpen] = useState<boolean>(false);

  // Keep sound effects sync
  useEffect(() => {
    soundEffects.enabled = soundEnabled;
  }, [soundEnabled]);

  // Active scene & active theme reference
  const currentScene = project.scenes[currentSceneIndex] || project.scenes[0];
  const activeTheme = THEMES[project.theme] || THEMES.modern;
  const duration = currentScene?.duration || 5;

  // Master Playback Timer Loop
  useEffect(() => {
    if (!isPlaying) return;

    const stepMs = 50;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + (stepMs / 1000) * playbackSpeed;
        if (nextTime >= duration) {
          // Advance to next scene
          soundEffects.playTransition();
          if (currentSceneIndex < project.scenes.length - 1) {
            setCurrentSceneIndex((idx) => idx + 1);
            return 0;
          } else if (isLooping) {
            setCurrentSceneIndex(0);
            return 0;
          } else {
            setIsPlaying(false);
            return duration;
          }
        }
        return nextTime;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPlaying, duration, currentSceneIndex, project.scenes.length, isLooping, playbackSpeed]);

  // Scene navigation handlers
  const handleSelectScene = (index: number) => {
    setCurrentSceneIndex(index);
    setCurrentTime(0);
    soundEffects.playTransition();
  };

  const handlePrevScene = () => {
    setCurrentTime(0);
    setCurrentSceneIndex((prev) => (prev > 0 ? prev - 1 : project.scenes.length - 1));
    soundEffects.playTransition();
  };

  const handleNextScene = () => {
    setCurrentTime(0);
    setCurrentSceneIndex((prev) => (prev < project.scenes.length - 1 ? prev + 1 : 0));
    soundEffects.playTransition();
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  // Scene modification handlers
  const handleUpdateCurrentScene = (updated: Partial<Scene>) => {
    setProject((prev) => {
      const newScenes = [...prev.scenes];
      newScenes[currentSceneIndex] = {
        ...newScenes[currentSceneIndex],
        ...updated,
      };
      return { ...prev, scenes: newScenes };
    });
  };

  const handleAddScene = (chartType: ChartType) => {
    let initialData: any = {};
    if (chartType === 'metric') {
      initialData = {
        primaryValue: 100,
        prefix: '$',
        suffix: 'K',
        label: 'Metric Highlight',
        trend: '+25%',
        trendType: 'positive',
        secondaryMetrics: [
          { id: 'sm-1', label: 'Metric Alpha', value: 85, suffix: '%' },
          { id: 'sm-2', label: 'Metric Beta', value: 42, suffix: '%' },
        ]
      };
    } else if (chartType === 'bar') {
      initialData = {
        items: [
          { id: 'b1', label: 'Category A', value: 65, formattedValue: '65', color: '#4F46E5' },
          { id: 'b2', label: 'Category B', value: 45, formattedValue: '45', color: '#059669' },
          { id: 'b3', label: 'Category C', value: 30, formattedValue: '30', color: '#D97706' },
        ],
        unit: 'Units'
      };
    } else if (chartType === 'donut') {
      initialData = {
        items: [
          { id: 'd1', label: 'Slice Alpha', value: 50, color: '#4F46E5' },
          { id: 'd2', label: 'Slice Beta', value: 30, color: '#059669' },
          { id: 'd3', label: 'Slice Gamma', value: 20, color: '#D97706' },
        ],
        centerValue: '100%',
        centerLabel: 'Total'
      };
    } else if (chartType === 'line') {
      initialData = {
        series: [
          {
            id: 's1',
            name: 'Velocity Trend',
            color: '#4F46E5',
            points: [
              { id: 'p1', x: 'Jan', y: 20 },
              { id: 'p2', x: 'Feb', y: 35 },
              { id: 'p3', x: 'Mar', y: 55 },
              { id: 'p4', x: 'Apr', y: 78 },
            ]
          }
        ]
      };
    } else if (chartType === 'versus') {
      initialData = {
        metricName: 'Direct Benchmark',
        entityA: {
          id: 'ea',
          name: 'Option 1',
          score: 85,
          formattedScore: '85',
          winner: true,
          color: '#4F46E5',
          stats: [{ label: 'Efficiency', value: '94%' }]
        },
        entityB: {
          id: 'eb',
          name: 'Option 2',
          score: 65,
          formattedScore: '65',
          color: '#059669',
          stats: [{ label: 'Efficiency', value: '72%' }]
        }
      };
    } else if (chartType === 'timeline') {
      initialData = {
        progressPercentage: 60,
        milestones: [
          { id: 't1', dateOrStep: 'Phase 1', title: 'Concept Genesis', description: 'Kickoff and initial exploratory tests', status: 'completed' },
          { id: 't2', dateOrStep: 'Phase 2', title: 'Beta Launch', description: 'Early tester deployment and feedback', status: 'active' },
          { id: 't3', dateOrStep: 'Phase 3', title: 'Scale Expansion', description: 'General availability rollout', status: 'upcoming' },
        ]
      };
    } else if (chartType === 'funnel') {
      initialData = {
        stages: [
          { id: 'f1', name: 'Impressions', value: 10000, formattedValue: '10K', conversionRate: '100%', color: '#4F46E5' },
          { id: 'f2', name: 'Clicks', value: 2500, formattedValue: '2.5K', conversionRate: '25%', color: '#059669' },
          { id: 'f3', name: 'Conversions', value: 750, formattedValue: '750', conversionRate: '30%', color: '#D97706' },
        ]
      };
    } else {
      initialData = {
        cards: [
          { id: 'g1', title: 'KPI One', value: '94%', subtitle: 'High consistency', delta: '+12%', color: '#4F46E5' },
          { id: 'g2', title: 'KPI Two', value: '1.4x', subtitle: 'Above baseline', delta: '+0.4x', color: '#059669' },
        ]
      };
    }

    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      title: `New ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Scene`,
      subtitle: 'Enter subtitle and descriptive context',
      chartType,
      duration: 5,
      transition: 'morph',
      takeaway: 'Key analytical takeaway from this data visual.',
      data: initialData,
    };

    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setCurrentSceneIndex(project.scenes.length);
    setCurrentTime(0);
    soundEffects.playTransition();
  };

  const handleDuplicateScene = (index: number) => {
    const sceneToDup = project.scenes[index];
    if (!sceneToDup) return;
    const duplicated: Scene = {
      ...JSON.parse(JSON.stringify(sceneToDup)),
      id: `scene-${Date.now()}`,
      title: `${sceneToDup.title} (Copy)`,
    };
    const newScenes = [...project.scenes];
    newScenes.splice(index + 1, 0, duplicated);
    setProject((prev) => ({ ...prev, scenes: newScenes }));
    setCurrentSceneIndex(index + 1);
    setCurrentTime(0);
  };

  const handleDeleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    const newScenes = project.scenes.filter((_, i) => i !== index);
    setProject((prev) => ({ ...prev, scenes: newScenes }));
    setCurrentSceneIndex(Math.max(0, index - 1));
    setCurrentTime(0);
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.scenes.length) return;
    const newScenes = [...project.scenes];
    const [moved] = newScenes.splice(index, 1);
    newScenes.splice(targetIdx, 0, moved);
    setProject((prev) => ({ ...prev, scenes: newScenes }));
    setCurrentSceneIndex(targetIdx);
  };

  // Preset & Theme handlers
  const handleLoadPreset = (presetKey: string) => {
    if (PRESET_PROJECTS[presetKey]) {
      setProject(PRESET_PROJECTS[presetKey]);
      setCurrentSceneIndex(0);
      setCurrentTime(0);
      soundEffects.playChime();
    }
  };

  const handleChangeTheme = (themeId: ThemeId) => {
    setProject((prev) => ({ ...prev, theme: themeId }));
  };

  const handleUpdateTitle = (title: string) => {
    setProject((prev) => ({ ...prev, title }));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <StudioHeader
        project={project}
        currentTheme={project.theme}
        aspectRatio={aspectRatio}
        onUpdateTitle={handleUpdateTitle}
        onChangeTheme={handleChangeTheme}
        onChangeAspectRatio={setAspectRatio}
        onLoadPreset={handleLoadPreset}
        onOpenPresenter={() => setIsPresenterOpen(true)}
        onImportProject={(imported) => {
          setProject(imported);
          setCurrentSceneIndex(0);
          setCurrentTime(0);
        }}
      />

      {/* Main Studio Middle Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Storyboard Sidebar */}
        <StoryboardSidebar
          scenes={project.scenes}
          currentSceneIndex={currentSceneIndex}
          onSelectScene={handleSelectScene}
          onAddScene={handleAddScene}
          onDuplicateScene={handleDuplicateScene}
          onDeleteScene={handleDeleteScene}
          onMoveScene={handleMoveScene}
        />

        {/* Center Viewport Stage */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
          <CanvasStage
            scene={currentScene}
            theme={activeTheme}
            aspectRatio={aspectRatio}
            sceneIndex={currentSceneIndex}
            totalScenes={project.scenes.length}
            currentTime={currentTime}
            duration={duration}
          />
        </main>

        {/* Right Inspector & Data Editor Panel */}
        <InspectorPanel
          activeScene={currentScene}
          theme={activeTheme}
          onUpdateScene={handleUpdateCurrentScene}
          onLoadProject={(newProj) => {
            setProject(newProj);
            setCurrentSceneIndex(0);
            setCurrentTime(0);
            soundEffects.playChime();
          }}
        />
      </div>

      {/* Bottom Timeline & Motion Controls Bar */}
      <TimelineBar
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onPrevScene={handlePrevScene}
        onNextScene={handleNextScene}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        isLooping={isLooping}
        onToggleLoop={() => setIsLooping(!isLooping)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeTransition={currentScene.transition}
        onChangeTransition={(trans: TransitionType) => handleUpdateCurrentScene({ transition: trans })}
        onDurationChange={(secs: number) => handleUpdateCurrentScene({ duration: secs })}
      />

      {/* Fullscreen Presenter Mode Modal */}
      {isPresenterOpen && (
        <PresenterModal
          scenes={project.scenes}
          initialIndex={currentSceneIndex}
          theme={activeTheme}
          aspectRatio={aspectRatio}
          onClose={() => setIsPresenterOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
