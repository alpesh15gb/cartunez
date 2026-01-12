# Updating Homepage Content

1.  **Deploy Static Content**: Since we updated `.less` files, run this on your server:
    ```bash
    docker compose run --rm app bin/magento setup:static-content:deploy -f
    ```

2.  **Update Homepage CMS Block**:
    - Go to **Admin > Content > Elements > Pages > Home Page**.
    - Open the Content tab.
    - **Delete** the old content.
    - **Paste** the *full content* from `homepage_content.html` (I have updated this file).
    - Save.

3.  **Update Footer (Optional)**:
    - You can create a new CMS Block called `footer_block` and paste the content from `footer_content.html`.
    - Then create a Widget in **Content > Elements > Widgets** to place this block in the "Footer Container".
    - Or better, let me know if you want me to inject it via XML.
