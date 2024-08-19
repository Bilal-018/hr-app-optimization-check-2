import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFViewer(props: any) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: {
        numPages: number;
    }) {
        setNumPages(nextNumPages);
    }

    function onPageLoadSuccess() {
        setLoading(false);
    }

    const options = {
        cMapUrl: "cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "standard_fonts/",
    };

    // Go to next page
    function goToNextPage() {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }

    function goToPreviousPage() {
        setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100%', overflowY: 'auto', width: '100%' }}>
            <Nav pageNumber={pageNumber} numPages={numPages} fileName={props.fileName} />
            <Box
                hidden={loading}
                sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '96%',
                        position: 'absolute',
                        zIndex: 10,
                        paddingX: 2,
                    }}
                >
                    <Button
                        onClick={goToPreviousPage}
                        disabled={pageNumber <= 1}
                        size="small"
                        sx={{
                            // height: 'calc(100% - 64px)',
                            paddingX: 2,
                            // paddingY: 6,
                            color: 'gray',
                            '&:hover': { color: 'white', backgroundColor: 'gray' },
                            zIndex: 20,
                        }}
                    >
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        size="small"
                        sx={{
                            // height: 'calc(100% - 64px)',
                            paddingX: 2,
                            // paddingY: 6,
                            color: 'gray',
                            '&:hover': { color: 'white', backgroundColor: 'gray' },
                            zIndex: 20,
                        }}
                    >
                        <span className="sr-only">Next</span>
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        // mx: 'auto',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Document
                        file={props.file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                        renderMode="canvas"
                    >
                        <Page
                            key={pageNumber}
                            pageNumber={pageNumber}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            onLoadSuccess={onPageLoadSuccess}
                            onRenderError={() => { setLoading(false) }}
                        />
                    </Document>
                </Box>
            </Box>
        </Box>
    );
}


function Nav({ pageNumber, numPages, fileName }: { pageNumber: number, numPages: number, fileName: string }) {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '-0.5px', color: 'white' }}>
                        {fileName}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ backgroundColor: 'gray', paddingX: 2, paddingY: 1, borderRadius: 1, color: 'white' }}>
                        <Typography variant="body2">
                            {pageNumber} <span style={{ color: 'lightgray' }}> / {numPages}</span>
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}