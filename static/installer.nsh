!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\Cabinet"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\Cabinet"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\Cabinet"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\Cabinet"
!macroend