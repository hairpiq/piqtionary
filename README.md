# piqtionary
create and share hairpiqs

<pre>

+----------------------------------------------+
|                                              |
|          Multibranch Pipeline Process        |
|                                              |
+----------------------------------------------+
|                                              |
|  branches    ci.hairpiq.com    environments  |
|                                              |
| +------------------------------------------+ |
|                                              |
| +--------+                                   |
| |  DEV   |   +------------>   d.hairpiq.com  |
| +--------+                                   |
|     ||                                       |
|     <>                                       |
| +--------+                                   |
| |  TEST  |   +------------>   t.hairpiq.com  |
| +--------+                                   |
|     ||                                       |
|     <>                                       |
| +--------+                                   |
| | master |   +------------>   s.hairpiq.com  |
| +--------+                                   |
|                                              |
+----------------------------------------------+

</pre>