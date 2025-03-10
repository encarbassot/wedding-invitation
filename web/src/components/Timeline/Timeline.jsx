import './Timeline.css';

const timelineData = [
  { date: "12:30", title: "Arribada", description: "Us esperem amb il·lusió a l'Hotel Alimara per començar aquest dia tan especial junts." },
  { date: "13:00", title: "Cerimònia", description: "Intercanviarem els nostres vots en un entorn màgic al jardí de l'Hotel Alimara." },
  { date: "13:30", title: "Pica-pica", description: "Brindem plegats! Gaudirem d'un aperitiu exquisit al jardí, envoltats de bones converses i somriures." },
  { date: "14:30", title: "Dinar", description: "Prepareu-vos per un banquet deliciós ple de moments inoblidables i algun que altre discurs sorpresa!" },
  { date: "16:00", title: "Cafè, copa i puro", description: "Un moment de pausa per assaborir un bon cafè, brindar amb una copa i, pels clàssics, un puro!" },
  { date: "18:00", title: "Festa & Ball", description: "Que comenci la festa! Música, rialles i moltes ganes de ballar fins que el cos digui prou!" },
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
