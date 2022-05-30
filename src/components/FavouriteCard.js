import { Panel } from "rsuite";
function FavouriteCard(props) {
  console.log(props);
  return <Panel className="reviewCard" bordered header={props.name}></Panel>;
}

export default FavouriteCard;
