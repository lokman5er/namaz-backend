import "./Left.css";

function Left({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="left">{children}</div>
        </>
    );
}

export default Left;
