import Image from 'next/image';

export default function AgentAvatar() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-[-8px] orbit-ring" />
      <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,170,0.2))' }} />
      <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,170,0.1))', border: '1px solid rgba(0,240,255,0.3)' }}>
        <Image
          src="/icons/robot.png"
          alt="HelpfulBot"
          width={48}
          height={48}
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
        />
      </div>
      <div className="absolute -bottom-1 -right-1"><div className="status-online" /></div>
    </div>
  );
}
