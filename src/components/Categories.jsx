import { TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const PriceChangeCell = ({ value }) => {
  const arrowUpOrDown = (value) => {
    const direction = value?.toString().startsWith("-") ? "down" : "up";
    return (
      <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d={direction === "up" ? "M7 14l5-5 5 5H7z" : "M7 10l5 5 5-5H7z"}
        />
      </svg>
    );
  };

  const formatPercentage = (value) => {
    return Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: "never",
    }).format(value / 100);
  };

  return (
    <TableCell
      className={
        value?.toString().startsWith("-") ? "text-red-500" : "text-green-500"
      }
    >
      <div className="flex">
        {arrowUpOrDown(value)}
        {formatPercentage(value)}
      </div>
    </TableCell>
  );
};

PriceChangeCell.propTypes = {
  value: PropTypes.number
};

export default function Categories({ post, index }) {
  return (
    <TableRow>
      <TableCell className="flex items-center">
        <Link to={`/${post.id}`} className="w-full">
          <div className="w-full">
            <span className="mr-2">{index + 1}.</span>
            <span>{post.name}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <img
          width={25}
          alt={post.name}
          src={post.top_3_coins}
          style={{ marginRight: "5px" }}
        />
      </TableCell>
      <PriceChangeCell value={post.market_cap_change_24h} />
      <TableCell> {post.volume_24h} $US</TableCell>
      <TableCell> {post.market_cap} $US</TableCell>
    </TableRow>
  );
}

Categories.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    top_3_coins: PropTypes.arrayOf(PropTypes.string), // Change this line
    market_cap_change_24h: PropTypes.number.isRequired,
    volume_24h: PropTypes.number.isRequired,
    market_cap: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
