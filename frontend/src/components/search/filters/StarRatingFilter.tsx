type Props = {
    selectedStars: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const StarRatingFilter = ({ selectedStars, onChange }: Props) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h4 className="text-sm font-semibold mr-7">Rating</h4>
            <div className="flex flex-wrap text-sm gap-2 md:gap-4">
                {["5", "4", "3", "2", "1"].map((star, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" value={star}
                            checked={selectedStars.includes(star)} onChange={onChange} />
                        <span className="px-2">{star} Stars</span>
                    </label>
                ))}
            </div>
        </div>
    )
};

export default StarRatingFilter;
