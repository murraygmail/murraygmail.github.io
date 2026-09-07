images/ — the only photography on this site
===========================================

This folder holds one file:

    murray-cantor.jpg    640 x 776, 113 KB, progressive JPEG, no EXIF

That is Murray's portrait, supplied by him on 3 September 2026 and used on two pages:
small in the masthead of index.html, larger beside the opening paragraphs of about.html.
Nothing else belongs in this folder. The design carries no stock imagery, no decorative
photographs and no icons, and the masthead mark on the home page is inline SVG, not a
file.

The picture is the supplied original scaled down and re-encoded. It is not cropped: the
original is 1998 x 2422, a 1 : 1.2125 portrait rather than the 4:5 the layout was first
drawn for, and the layout was adjusted to the picture instead — see NOTES.md section 9
for why.


IF THE PICTURE IS EVER REPLACED
-------------------------------

Keep the filename, or three references break: the two <img src> attributes and the
og:image meta tag on each of index.html and about.html.

Aim for about 640 pixels on the long-enough side that the width comes out near 640 — that
is the 300px-wide about.html placement at 2x on a retina screen. JPEG quality 90 or so,
progressive, EXIF stripped, under about 300 KB.

Then recompute the width and height attributes on both <img> tags from the new file's
ratio, because they are what reserves the space before the picture loads and stops the
page jumping:

    index.html    width = 160,  height = round(160 x fileheight / filewidth)
    about.html    width = 300,  height = round(300 x fileheight / filewidth)

At 640 x 776 those come out as 160 x 194 and 300 x 364, which is what is in the files
now. Update og:image:width and og:image:height on both pages to the new file's real
dimensions at the same time.

The frame around the picture is set in site.css under "portrait": a 1px hairline in the
site rule colour, a 3px garnet left edge, 3px corner radius. No shadow, no circle, no
crop. If a replacement picture has a much lighter background than this one, look at the
rendered page before deciding the frame needs any more weight — this one did not.
