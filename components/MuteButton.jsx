export default function MuteButton({ muted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded text-sm font-semibold shadow transition
        ${muted ? 'bg-red-600 text-white' : 'bg-neutral-700 text-white'}
      `}
    >
      {muted ? '🔇 Mutato' : '🔊 Mute'}
    </button>
  );
}
