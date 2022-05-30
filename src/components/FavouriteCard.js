import { Panel } from "rsuite";
function FavouriteCard(props) {
  return <Panel className="reviewCard" bordered header={props.name}></Panel>;
}

export default FavouriteCard;
