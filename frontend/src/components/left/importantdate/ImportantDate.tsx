import "./ImportantDate.css";

function ImportantDate() {
    return (
        <>
            <div className="l-6">
                <div className="l-6-1 tri">▶</div>
                <div className="l-6-2 rec" id="box1">
                    <div className="l-6-2-1 l6-title">
                        <strong id="importantDate1Day">00</strong>
                        <span>.</span>
                        <strong id="importantDate1Month">00</strong>
                        <span>.</span>
                        <strong id="importantDate1Year">0000</strong>
                    </div>
                    <div
                        className="l-6-2-2 l6-description resize"
                        id="importantDateTextLeft"
                    ></div>
                </div>
                <div className="l-6-3 tri">▶</div>
                <div className="l-6-4 rec">
                    <div className="l-6-4-1 l6-title">
                        <strong id="importantDate2Day">00</strong>
                        <span>.</span>
                        <strong id="importantDate2Month">00</strong>
                        <span>.</span>
                        <strong id="importantDate2Year">0000</strong>
                    </div>
                    <div
                        className="l-6-4-2 l6-description resize"
                        id="importantDateTextRight"
                    ></div>
                </div>
                <div className="l-6-5 tri">▶</div>
            </div>
        </>
    );
}

export default ImportantDate;
