import "./Yatsi.css";

function Yatsi() {
    return (
        <>
            <svg
                id="yatsi"
                className="yatsi"
                data-name="yatsi"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 775.92 228.35"
            >
                <defs>
                    <style id="style">
                        {`
                            .cls-1 {
                                fill: #2c7291;
                        }

                            .cls-2 {
                                fill: url(#linear-gradient);
                        }

                            .cls-3 {
                                fill: url(#linear-gradient-2);
                        }

                            .cls-4 {
                                fill: #1f5260;
                        }
                            @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                            }
                        `}
                    </style>
                    <linearGradient
                        id="linear-gradient"
                        x1="-2279.83"
                        y1="-2738.49"
                        x2="-2279.92"
                        y2="-2515.54"
                        gradientTransform="translate(3809.93 884.35) rotate(-36.02)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#083640" />
                        <stop
                            offset="0.81"
                            stopColor="#083640"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="linear-gradient-2"
                        x1="301.13"
                        y1="154.43"
                        x2="393.1"
                        y2="-4.85"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop id="stop1" offset="0" stopColor="#2c7291" />
                        <stop id="stop2" offset="1" stopColor="#1f5260" />
                    </linearGradient>
                </defs>
                <rect
                    id="s1"
                    fill="#2c7291"
                    x="386.98"
                    width="388.94"
                    height="108.21"
                />
                <path
                    id="s2"
                    fill="url(#linear-gradient)"
                    d="M431,22.29h0A54.11,54.11,0,0,0,343.5,85.93h0l91.2,142.42,103.69-75.41Z"
                />
                <path
                    id="s3"
                    fill="url(#linear-gradient-2)"
                    d="M441.09,54.11A54.1,54.1,0,0,0,358.26,8.26l0,0-100.61,65L339.19,176.4,424.3,93.27A54,54,0,0,0,441.09,54.11Z"
                />
                <path
                    id="s4"
                    fill="#1f5260"
                    d="M337,173.6a65.72,65.72,0,0,1-39.05,12.8H70a66,66,0,0,1,0-132H286.8L257.63,73.21Z"
                />
                <path
                    id="s1"
                    fill="#2c7291"
                    d="M293.92,62.37H66a66,66,0,0,0,0,132H293.92a66,66,0,0,0,0-132Z"
                />
                <text
                    id="tr"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="135"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    YATSI
                </text>
                <text
                    id="ar"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="135"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="0"
                    style={{ fontFamily: "Hafs" }}
                >
                    العشاء
                </text>
                <text
                    id="de"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="135"
                    fontSize="0.9em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    NACHTS
                </text>
                <text
                    textAnchor="middle"
                    x="535"
                    y="80"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="hour1 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    textAnchor="middle"
                    x="582"
                    y="80"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="hour2 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    x="610"
                    y="75"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    :
                </text>
                <text
                    textAnchor="middle"
                    x="653"
                    y="80"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="minute1 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    textAnchor="middle"
                    x="701"
                    y="80"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="minute2 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
            </svg>
        </>
    );
}

export default Yatsi;
