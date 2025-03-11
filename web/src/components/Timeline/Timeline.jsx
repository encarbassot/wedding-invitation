import './Timeline.css';

const timelineData = [
  { date: "12:30", title: "Arribada", description: "Us esperem a tots a l'hotel Alimara, ben puntuals i pentinats." },
  { date: "13:00", title: "El moment esperat", description: "Us hi volem de testimonis, serem al jardí de l'hotel." },
  { date: "13:30", title: "Pica-pica", description: "Brindem plegats i fem un pica-pica al mateix jardí." },
  { date: "14:30", title: "Dinar", description: "Seurem a taula i farem un bon àpat" },
  { date: "16:00", title: "Cafè, copa i puro", description: "I si cal, un digestiu" },
  { date: "18:00", title: "Festa & Ball", description: "Seguirem amb la festa, música, ball...." },
  { date: "...", title: "Els més valents", description: "La nit és jove! Continuarem fins que les cames aguantin (o ens facin fora)!" }
];

export default function Timeline() {
  return (
  <section className="Timeline">
      <div className="timeline">
        <ul>
          {timelineData.map((item, index) => (
            <li key={index}
            //  data-aos={index%2===0?"fade-right":"fade-left"}
            >
              <div className="timeline-content">
                <h3 className="date">{item.date}</h3>
                <h1>{item.title}</h1>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
