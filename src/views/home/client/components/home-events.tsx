import EventCard from "./event-card";

const HomeEvents: React.FC = () => {
  return (
    <div className="min-h-40 w-full flex items-center overflow-scroll scrollbar-hide snap-x snap-mandatory">
      <div className="min-w-[300%] flex items-center">
        <EventCard
          title="Pickleball tournament"
          description="Registro abierto para el inicio de la nueva temporada"
          link="/event/34523"
        />

        <EventCard
          title="Pickleball tournament"
          description="Registro abierto para el inicio de la nueva temporada"
          link="/event/34523"
        />

        <EventCard
          title="Pickleball tournament"
          description="Registro abierto para el inicio de la nueva temporada"
          link="/event/34523"
        />
      </div>
    </div>
  );
};

export default HomeEvents;
