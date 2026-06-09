import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Wire keyboard transport to a player: Space = play/pause, ←/→ = step.
 * Ignores key presses while typing in an input/textarea.
 */
export function useTransportKeys<T>(player: Player<T>) {
  const { toggle, stepForward, stepBack } = player;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepForward();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, stepForward, stepBack]);
}

/**
 * Generic frame player. Given a fixed-length list of frames it exposes a
 * current index plus transport controls (play / pause / step / scrub / restart)
 * and a speed setting. Because frames are precomputed and immutable, every
 * control is just index arithmetic — rewinding is as cheap as fast-forwarding.
 */
export interface Player<T> {
  frames: T[];
  index: number;
  current: T | undefined;
  isPlaying: boolean;
  atStart: boolean;
  atEnd: boolean;
  /** Frames per second. */
  speed: number;
  progress: number; // 0..1
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  seek: (i: number) => void;
  restart: () => void;
  setSpeed: (fps: number) => void;
}

export function usePlayer<T>(
  frames: T[],
  initialSpeed = 6,
  autoPlay = false,
  loop = false,
): Player<T> {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const timer = useRef<number | null>(null);

  const lastIndex = Math.max(0, frames.length - 1);
  const atEnd = index >= lastIndex;
  const atStart = index <= 0;

  // Reset to the first frame whenever the frame set itself changes (e.g. a new
  // algorithm is selected or the array is reshuffled). When autoPlay is on
  // (interactive op sims), start playing the new animation immediately.
  useEffect(() => {
    setIndex(0);
    setIsPlaying(autoPlay && frames.length > 1);
  }, [frames, autoPlay]);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  // Drive playback off an interval keyed to the current speed.
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= lastIndex) {
          if (loop) return 0; // wrap for looping previews
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1000 / speed);
    return clearTimer;
  }, [isPlaying, speed, lastIndex, loop]);

  const play = useCallback(() => {
    if (frames.length === 0) return;
    // Replaying from the end restarts from the top.
    setIndex((i) => (i >= lastIndex ? 0 : i));
    setIsPlaying(true);
  }, [frames.length, lastIndex]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && frames.length) {
        setIndex((i) => (i >= lastIndex ? 0 : i));
        return true;
      }
      return false;
    });
  }, [frames.length, lastIndex]);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.min(lastIndex, i + 1));
  }, [lastIndex]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const seek = useCallback(
    (i: number) => {
      setIsPlaying(false);
      setIndex(Math.max(0, Math.min(lastIndex, i)));
    },
    [lastIndex],
  );

  const restart = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const progress = lastIndex === 0 ? 0 : index / lastIndex;

  return useMemo(
    () => ({
      frames,
      index,
      current: frames[index],
      isPlaying,
      atStart,
      atEnd,
      speed,
      progress,
      play,
      pause,
      toggle,
      stepForward,
      stepBack,
      seek,
      restart,
      setSpeed,
    }),
    [
      frames,
      index,
      isPlaying,
      atStart,
      atEnd,
      speed,
      progress,
      play,
      pause,
      toggle,
      stepForward,
      stepBack,
      seek,
      restart,
    ],
  );
}
