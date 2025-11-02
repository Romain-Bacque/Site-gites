import {
  faEnvelope,
  faPeopleGroup,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Card from "../../../UI/Card";
import { HandleEmailModalDisplay } from "../types";
import classes from "./style.module.css";
import Button from "components/UI/Button";

// interfaces
interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  numberOfPerson: number;
  from: Date;
  to: Date;
  informations: string;
  status: "pending" | "accepted" | "refused";
  shelter_id: {
    title: string;
    number: number;
  };
}
interface BookingCardProps {
  booking: Booking;
  onChoice: HandleEmailModalDisplay;
  onDelete: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onChoice,
  onDelete,
}) => {
  const bookingFormattedData = {
    bookingId: booking._id,
    shelter: booking.shelter_id.title,
    name: booking.name,
    from: dayjs(booking.from).format("DD/MM/YYYY"),
    to: dayjs(booking.to).format("DD/MM/YYYY"),
    emailTo: booking.email,
  };
  
  const bookingStatusMsg =
    booking.status === "pending"
      ? "En attente"
      : booking.status === "accepted"
      ? "Acceptée"
      : "Refusée";

      return (
    <Card className={classes["booking-card"]}>
      <div className={classes["booking-card__title"]}>
        <h3 className={classes["booking-card__title-text"]}>
          {booking.shelter_id.title}
        </h3>
        <div className={classes["booking-card__status"]}>
          <span>Statut : {bookingStatusMsg}</span>
          {booking.status === "refused" && (
            <Button
              title="Supprimer la carte de réservation"
              className={classes["booking-card__delete-button"]}
              onClick={() => onDelete(booking._id)}
              icon={() => <FontAwesomeIcon icon={faTrash} />}
            />
          )}
        </div>
      </div>
      <div className={classes["booking-card__container"]}>
        <div className={classes["booking-card__user-datas"]}>
          <div className={classes["booking-card__name"]}>{booking.name}</div>
          <div className={classes["booking-card__contact"]}>
            <FontAwesomeIcon icon={faPhone} />
            <div>{booking.phone}</div>
          </div>
          <div className={classes["booking-card__contact"]}>
            <FontAwesomeIcon icon={faEnvelope} />
            <a href={`mailto:${booking.email}`}>{booking.email}</a>
          </div>
          <div className={classes["booking-card__contact"]}>
            <FontAwesomeIcon icon={faPeopleGroup} />
            <div>{booking.numberOfPerson}</div>
          </div>
          <div className={classes["booking-card__date"]}>
            Du {dayjs(booking.from).format("DD/MM/YYYY")}
          </div>
          <div className={classes["booking-card__date"]}>
            Au {dayjs(booking.to).format("DD/MM/YYYY")}
          </div>
          <div>
            <div className={classes["booking-card__informations-title"]}>
              Informations:
            </div>
            <div className={classes["booking-card__informations-text"]}>
              {booking.informations
                ? booking.informations
                : "Aucune information complémentaire."}
            </div>
          </div>
        </div>
        <div className="button-container">
          {booking.status === "accepted" && (
            <button
              className="button button--alt"
              onClick={() => onChoice("refused", bookingFormattedData)}
            >
              Annuler la réservation
              <FontAwesomeIcon className="button__icon" icon={faTrash} />
            </button>
          )}
          {(booking.status === "pending" || booking.status === "refused") && (
            <button
              className="button"
              onClick={() => onChoice("accepted", bookingFormattedData)}
            >
              Accepter
            </button>
          )}
          {booking.status === "pending" && (
            <button
              className="button button--alt"
              onClick={() => onChoice("refused", bookingFormattedData)}
            >
              Refuser
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
