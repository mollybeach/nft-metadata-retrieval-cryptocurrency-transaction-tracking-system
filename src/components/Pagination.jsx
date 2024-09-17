import PropTypes from 'prop-types';
import { Button } from "./ui/button";

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
  pagesCount,
  pagesCutCount,
}) {
  const getPagesCut = ({ pagesCount, pagesCutCount, currentPage }) => {
    const ceiling = Math.ceil(pagesCutCount / 2);
    const floor = Math.floor(pagesCutCount / 2);
    if (pagesCount < pagesCutCount) {
      return { start: 1, end: pagesCount + 1 };
    } else if (currentPage >= 1 && currentPage <= ceiling) {
      return { start: 1, end: pagesCutCount + 1 };
    } else if (currentPage + floor >= pagesCount) {
      return { start: pagesCount - pagesCutCount + 1, end: pagesCount + 1 };
    } else {
      return { start: currentPage - ceiling + 1, end: currentPage + floor + 1 };
    }
  };
  const { start, end } = getPagesCut({
    pagesCount,
    pagesCutCount,
    currentPage,
  });
  return (
    <div className="flex items-center gap-4">
      {currentPage > 1 && (
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex items-center gap-2 rounded-full bg-black hover:bg-slate-300 hover:text-black"
        >
          Previous
        </Button>
      )}
      {Array.from({ length: end - start }, (_, index) => (
        <Button
          key={start + index}
          onClick={() => setCurrentPage(start + index)}
          disabled={currentPage === start + index}
          className="rounded-full bg-black hover:bg-slate-300 hover:text-black"
        >
          {start + index}
        </Button>
      ))}
      {currentPage < totalPages && end < totalPages - 1 && (
        <>
          <span className="mx-2">...</span>
        </>
      )}
      {currentPage < totalPages && end < totalPages && (
        <Button
          onClick={() => setCurrentPage(totalPages)}
          className="flex items-center gap-2 rounded-full bg-black hover:bg-slate-300 hover:text-black"
        >
          {totalPages}
        </Button>
      )}
      {currentPage < totalPages && (
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="flex items-center gap-2 rounded-full bg-black hover:bg-slate-300 hover:text-black"
        >
          Next
        </Button>
      )}
    </div>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  pagesCutCount: PropTypes.number.isRequired,
};
