import './EraPicker.css'

const ERA_DESCRIPTIONS = {
  era0: 'Mourning, Hardaway, Grant Hill, Shaq',
  era1: 'Iverson, Duncan, Carmelo, KD',
  era2: 'Jay Williams, Boozer, Chris Paul',
  era3: 'Iverson, Duncan, Carmelo, KD',
  era4: 'Kyrie, Kemba, Kawhi, Zion',
  era5: 'Grayson, Zion, Trae, Lonzo',
  era6: 'Zach Edey, Cooper Flagg, Caitlin Clark',
  era7: 'Current Season',
}

export default function EraPicker({ conference, eras, onChoose }) {
  return (
    <div className="era-wrap">
      <h2 className="era-title">
        <span style={{ color: 'var(--orange)' }}>{conference.name}</span> — Pick an Era
      </h2>

      <div className="era-grid">
        {eras.map(era => (
          <button
            key={era.id}
            className="era-card"
            onClick={() => onChoose(era)}
          >
            <span className="era-short">{era.short}</span>
            <span className="era-label">{era.label}</span>
            <span className="era-desc">{ERA_DESCRIPTIONS[era.id] ?? ''}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
