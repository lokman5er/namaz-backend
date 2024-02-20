import "./Imsak.css";

function Imsak() {
    return (
        <>
            <svg
                id="imsak"
                className="imsak"
                data-name="imsak"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 775.92 314.53"
            >
                <defs>
                    <style>
                        {`@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                                @font-face {
                                    font-family: "Hafs";
                                    src: url("hafs.otf");
                                    fontWeight: normal;
                                }`}
                    </style>
                    <linearGradient
                        id="linear-gradient"
                        x1="-1412.22"
                        y1="-2370.21"
                        x2="-1412.31"
                        y2="-2147.27"
                        gradientTransform="translate(2891.64 1182.92) rotate(-36.02)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#0c7f82" />
                        <stop
                            offset="0.81"
                            stopColor="#083640"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="linear-gradient-2"
                        x1="301.13"
                        y1="39.94"
                        x2="393.1"
                        y2="199.24"
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
                    y="86.18"
                    width="388.94"
                    height="108.21"
                />
                <path
                    id="s2"
                    fill="url(#linear-gradient)"
                    d="M431,108.47h0a54.11,54.11,0,0,0-87.53,63.64h0l91.2,142.42,103.69-75.41Z"
                />
                <path
                    id="s3"
                    fill="url(#linear-gradient-2)"
                    d="M425,101.77h0L339.19,18,257.63,121.16l100.61,65h0A54.09,54.09,0,0,0,425,101.77Z"
                />
                <path
                    id="s4"
                    fill="#1f5260"
                    d="M286.83,140l-29.2-18.86L337,20.79A65.75,65.75,0,0,0,297.92,8H70a66,66,0,0,0,0,132H286.83Z"
                />
                <path
                    id="s1"
                    fill="#2c7291"
                    d="M293.94,0H66a66,66,0,1,0,0,132H293.9a66,66,0,1,0,0-132Z"
                />
                <text
                    id="tr"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="75"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    İMSAK
                </text>
                <text
                    id="ar"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="75"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="0"
                    style={{ fontFamily: "Hafs" }}
                >
                    الإمساك
                </text>
                <text
                    id="de"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="75"
                    fontSize="0.9em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    opacity="0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    MORGENS
                </text>
                <text
                    textAnchor="middle"
                    x="535"
                    y="165"
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
                    y="165"
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
                    y="160"
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
                    y="165"
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
                    y="165"
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

export default Imsak;
