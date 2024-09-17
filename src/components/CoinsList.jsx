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

export default function CoinsList({ post }) {
  return (
    <TableRow>
      <TableCell className={`${post.name === "Chiliz" ? "text-red-500" : ""}`}>
        <Link to={`/${post.id}`}>
          <div className="flex items-center">
            <span className="mr-2">{post.market_cap_rank}.</span>
            <img
              width={25}
              alt={post.name}
              src={post.image}
              style={{ marginRight: "5px" }}
            />
            <div className="space-x-3">
              <span className="font-semibold">{post.name}</span>
              <span className="uppercase text-gray-500">{post.symbol}</span>
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell>${post.current_price}</TableCell>
      <PriceChangeCell value={post.price_change_percentage_1h_in_currency} />
      <PriceChangeCell value={post.price_change_percentage_24h_in_currency} />
      <PriceChangeCell value={post.price_change_percentage_7d_in_currency} />
      <TableCell>${post.ath}</TableCell>
    </TableRow>
  );
}

CoinsList.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    market_cap_rank: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    current_price: PropTypes.number.isRequired,
    price_change_percentage_1h_in_currency: PropTypes.number,
    price_change_percentage_24h_in_currency: PropTypes.number,
    price_change_percentage_7d_in_currency: PropTypes.number,
    ath: PropTypes.number.isRequired,
  }).isRequired,
};
