<?php
/**
 * Car Tunez Child Theme Functions
 */

function cartunez_enqueue_styles()
{
    // Enqueue Parent Theme Styles (Astra)
    wp_enqueue_style('astra-parent-style', get_template_directory_uri() . '/style.css');

    // Enqueue Child Theme Styles
    wp_enqueue_style('cartunez-child-style', get_stylesheet_directory_uri() . '/style.css', array('astra-parent-style'));

    // Enqueue Google Fonts (Orbitron for headers, Roboto for body)
    wp_enqueue_style('cartunez-google-fonts', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap', false);
}
add_action('wp_enqueue_scripts', 'cartunez_enqueue_styles');
