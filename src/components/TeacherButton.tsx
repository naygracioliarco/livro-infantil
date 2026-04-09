import { useState } from 'react';

interface TeacherButtonProps {
    title?: string;
    content?: React.ReactNode;
    answers?: React.ReactNode;
}

function TeacherButton({
    title,
    content,
    answers
}: TeacherButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="professor-button"
                style={{
                    position: 'relative',
                    padding: '10px 30px 10px 45px',
                    backgroundColor: '#F26522',
                    boxShadow: '0px 4px 0px #c64f12',
                    borderRadius: '0 30px 30px 0',
                    color: 'white',
                    fontFamily: 'Ubuntu',
                    fontSize: '12px',
                    fontWeight: 700,
                    lineHeight: '1.4em',
                    textTransform: 'none',
                    textDecoration: 'none',
                    margin: '1em 0.4em 1.4em 1.4em',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E04F16';
                    e.currentTarget.style.boxShadow = '0px 2px 0px #b13f11';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F26522';
                    e.currentTarget.style.boxShadow = '0px 4px 0px #c64f12';
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '-15px',
                        top: '54%',
                        transform: 'translateY(-50%)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        backgroundColor: '#F26522',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        background: 'transparent url("/images/iconTeacher.svg") no-repeat center',
                        backgroundSize: '100%',
                    }}
                />
                PARA O PROFESSOR
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">PARA O PROFESSOR</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {title && (
                            <h4 className="text-xl font-semibold text-slate-700 mb-4">{title}</h4>
                        )}

                        {content && (
                            <div  className="mb-6">
                                <div className="text-slate-700 prose max-w-none teacher-modal-content">
                                    {content}
                                </div>
                            </div>
                        )}

                        {answers && (
                            <div>
                                <h5 className="text-lg font-semibold text-slate-600 mb-3">Respostas:</h5>
                                <div className="text-slate-700 prose max-w-none teacher-modal-content">
                                    {answers}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}

export default TeacherButton;

